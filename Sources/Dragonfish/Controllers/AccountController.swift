import Vapor
import Fluent
import JWT

struct AccountController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let accounts = routes.grouped("accounts")
        let secure = accounts.grouped(
            Session.Token.authenticator(), 
            Session.Token.guardMiddleware(), 
            IdentityGuard(needs: [.user])
        )

        secure.post("verify", use: verifyOwnership) 

        secure.group("profiles") { profiles in 
            profiles.get("all", use: getAll)
            profiles.post("create", use: createProfile)
            profiles.group(":id") { ops in 
                ops.patch("update", use: updateProfile)
                ops.patch("avatar", use: changeAvatar)
                ops.patch("banner", use: changeBanner)
                ops.delete("delete", use: deleteProfile)
            }
        }
    }

    // Account routes
    @Sendable
    func verifyOwnership(request: Request) async throws -> HTTPResponseStatus {
        struct VerifyInfo: Content, Validatable {
            let profileID: String

            static func validations(_ validations: inout Validations) {
                validations.add("profileID", as: String.self)
            }
        }

        try VerifyInfo.validate(content: request)
        let toVerify = try request.content.decode(VerifyInfo.self)

        guard let account = request.user?.account else {
            throw Abort(.unauthorized, reason: "You don't have permission to do that.")
        }

        if try await account.$profiles.query(on: request.db).filter(\.$id == toVerify.profileID).first() != nil {
            return .ok
        }

        return .forbidden
    }

    // Profile routes
    @Sendable
    func getAll(request: Request) async throws -> [ProfileObject] { 
        guard let account = request.user?.account else {
            throw Abort(.unauthorized, reason: "You don't have permission to do that.")
        }

        return try await account.$profiles.get(on: request.db).map { $0.toObject() }
    }

    @Sendable
    func createProfile(request: Request) async throws -> HTTPStatus { 
        guard let account = request.user?.account else {
            throw Abort(.unauthorized, reason: "You don't have permission to do that.")
        }

        let profiles = try await account.$profiles.get(on: request.db)
        if profiles.count == 3 {
            throw Abort(.forbidden, reason: "Accounts can only have a maximum of 3 profiles.")
        }

        try Profile.FormInfo.validate(content: request)
        let formInfo = try request.content.decode(Profile.FormInfo.self)

        let trimmedUsername = formInfo.username.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmedUsername.count < 3 || trimmedUsername.count > 32 {
            throw Abort(.badRequest, reason: "Your username should be between 3 and 32 characters long.")
        }

        let newProfile = Profile(from: formInfo)
        try await account.$profiles.create(newProfile, on: request.db)

        return .created
    }

    @Sendable
    func updateProfile(request: Request) async throws -> String { "hello world" }

    @Sendable
    func changeAvatar(request: Request) async throws -> String { "hello world" }

    @Sendable
    func changeBanner(request: Request) async throws -> String { "hello world" }

    @Sendable
    func deleteProfile(request: Request) async throws -> String { "hello world" }
}