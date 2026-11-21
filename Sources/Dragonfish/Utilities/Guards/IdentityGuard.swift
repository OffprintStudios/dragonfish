import Vapor
import Fluent

struct IdentityGuard: AsyncMiddleware {
    var requiredRoles: [Account.Roles]
    var checkProfile: Bool
    var optional: Bool

    func respond(to request: Request, chainingTo next: any AsyncResponder) async throws -> Response {
        guard let sessionToken = request.auth.get(Session.Token.self) else {
            if optional {
                return try await next.respond(to: request)
            }
            throw Abort(.unauthorized, reason: "You don't have permission to do that!")
        }

        guard try await Session.query(on: request.db)
            .filter(\.$id == sessionToken.sessionId)
            .filter(\.$account.$id == sessionToken.accountId)
            .filter(\.$expiresOn > Date.now)
            .first() != nil else {
            throw Abort(.unauthorized, reason: "You don't have permission to do that!")
        }

        guard let account = try await Account.find(sessionToken.accountId, on: request.db) else {
            throw Abort(.internalServerError, reason: "Something went wrong validating your session!")
        }

        guard canAccess(needs: requiredRoles, has: account.roles) else {
            throw Abort(.unauthorized, reason: "You don't have permission to do that!")
        }

        if checkProfile == true {
            guard let profileId: String = request.query["profileID"] else {
                throw Abort(.badRequest, reason: "You must include a `profileID` in your query parameters!")
            }

            guard let profile = try? await account.$profiles.query(on: request.db).filter(\.$id == profileId).first() else {
                request.logger.error("An attempt to authorize a profile's access level has failed. [Profile ID: \(profileId)] [Account ID: \(account.id?.uuidString ?? "")]")
                throw Abort(.unauthorized, reason: "You don't have permission to do that!")
            }

            request.user = .init(account: account, profile: profile)
        } else {
            request.user = .init(account: account, profile: nil)
        }

        return try await next.respond(to: request)
    }

    init(needs requiredRoles: [Account.Roles], checkProfile: Bool = false, optional: Bool = false) {
        self.requiredRoles = requiredRoles
        self.checkProfile = checkProfile
        self.optional = optional
    }
}