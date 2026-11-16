import Vapor
import Fluent

struct IdentityGuard: AsyncMiddleware {
    var requiredRoles: [Account.Roles]
    var checkProfile: Bool

    func respond(to request: Request, chainingTo next: any AsyncResponder) async throws -> Response {
        let sessionToken = try request.auth.require(Session.Token.self)

        if try await Session.query(on: request.db).filter(\.$id == sessionToken.sessionId).filter(\.$account.$id == sessionToken.accountId).first() == nil {
            throw Abort(.unauthorized, reason: "You don't have permission to do that!")
        }

        guard let account = try await Account.find(sessionToken.accountId, on: request.db) else {
            throw Abort(.internalServerError, reason: "Something went wrong validating your session!")
        }

        if canAccess(needs: requiredRoles, has: account.roles) {
            if checkProfile == true {
                guard let profileId: String = request.query["profileId"] else {
                    throw Abort(.badRequest, reason: "You must include a `profileId` in your query parameters!")
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
        } else {
            throw Abort(.unauthorized, reason: "You don't have permission to do that!")
        }
    }

    init(needs requiredRoles: [Account.Roles], checkProfile: Bool = false) {
        self.requiredRoles = requiredRoles
        self.checkProfile = checkProfile
    }
}