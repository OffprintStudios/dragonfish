import Vapor
import Fluent
import NanoID
import SwiftSoup
import Argon2Swift
import struct Foundation.UUID
import struct Foundation.Date
import struct Foundation.CharacterSet

final class Account: Model, @unchecked Sendable {
    static let schema = "accounts"

    @ID(key: .id)
    var id: UUID?

    @Field(key: FieldKeys.email)
    var email: String

    @Field(key: FieldKeys.password)
    var password: String

    @Field(key: FieldKeys.roles)
    var roles: [Roles]

    @Field(key: FieldKeys.termsAgree)
    var termsAgree: Bool

    @Field(key: FieldKeys.emailConfirmed)
    var emailConfirmed: Bool

    @Children(for: \.$account)
    var profiles: [Profile]

    @Children(for: \.$account)
    var sessions: [Session]

    @Children(for: \.$account)
    var codes: [OneTimeCode]

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    @Timestamp(key: FieldKeys.updatedAt, on: .update)
    var updatedAt: Date?

    init() { }

    init(id: UUID? = nil, with formInfo: RegisterForm) {
        self.id = id
        self.email = formInfo.email
        self.password = formInfo.password
        self.roles = [.user]
        self.termsAgree = formInfo.termsAgree
        self.emailConfirmed = false
    }

    func toObject(with token: String?) -> AccountObject {
        .init(
            id: self.id, 
            roles: self.$roles.value!, 
            termsAgree: self.$termsAgree.value!, 
            emailConfirmed: self.$emailConfirmed.value!, 
            createdAt: self.$createdAt.value!, 
            updatedAt: self.$updatedAt.value!,
            token: token
        )
    }
}

extension Account {
    struct Create: AsyncMigration {
        func prepare(on database: any Database) async throws {
            try await database.schema(Account.schema)
                .id()
                .field(FieldKeys.email, .string, .required)
                .field(FieldKeys.password, .string, .required)
                .field(FieldKeys.roles, .array(of: .string), .required)
                .field(FieldKeys.termsAgree, .bool, .required)
                .field(FieldKeys.emailConfirmed, .bool, .required)
                .field(FieldKeys.createdAt, .datetime)
                .field(FieldKeys.updatedAt, .datetime)
                .unique(on: FieldKeys.email)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(Account.schema).delete()
        }
    }

    struct Middleware: AsyncModelMiddleware {
        func create(model: Account, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            if try await Account.query(on: db).filter(\.$email == model.email).first() != nil {
                throw Abort(.conflict, reason: "An account with this email already exists!")
            }

            model.email = try SwiftSoup.clean(model.email, .none())!
            let cleanPassword = try SwiftSoup.clean(model.password, .none())!
            guard let hashedPassword = try? Argon2Swift.hashPasswordString(password: cleanPassword, salt: Salt.newSalt(), type: Argon2Type.id) else {
                throw Abort(.internalServerError, reason: "Failed to create your account. Contact an administrator for assistance.")
            }
            model.password = hashedPassword.encodedString().trimmingCharacters(in: CharacterSet(charactersIn: "\0"))

            return try await next.create(model, on: db)
        }
    }

    struct RegisterForm: Content, Validatable {
        var email: String
        var password: String
        var ageCheck: Bool
        var termsAgree: Bool

        static func validations(_ validations: inout Validations) {
            validations.add("email", as: String.self, is: .email)
            validations.add("password", as: String.self, is: .count(8...))
        }
    }

    enum Roles: String, Codable {
        case admin = "Admin"
        case moderator = "Moderator"
        case workApprover = "WorkApprover"
        case chatModerator = "ChatModerator"
        case contributor = "Contributor"
        case user = "User"
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let email: FieldKey = "email"
        static let password: FieldKey = "password"
        static let roles: FieldKey = "roles"
        static let termsAgree: FieldKey = "terms_agree"
        static let emailConfirmed: FieldKey = "email_confirmed"
        static let createdAt: FieldKey = "created_at"
        static let updatedAt: FieldKey = "updated_at"
    }
}

extension Account: ModelAuthenticatable {
    nonisolated(unsafe) static var usernameKey: KeyPath<Account, Field<String>> = \.$email
    nonisolated(unsafe) static var passwordHashKey: KeyPath<Account, Field<String>> = \.$password

    func verify(password: String) throws -> Bool {
        return try Argon2Swift.verifyHashString(password: password, hash: self.password, type: .id)
    }
}