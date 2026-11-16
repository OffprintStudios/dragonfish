import Vapor
import Fluent
import FluentSQL
import struct Foundation.Date

final class OneTimeCode: Model, @unchecked Sendable {
    static let schema = "one_time_codes"

    @ID(custom: FieldKeys.id, generatedBy: .user)
    var id: String?

    @Parent(key: FieldKeys.accountID)
    var account: Account

    @Field(key: FieldKeys.used)
    var used: Bool

    @Field(key: FieldKeys.kind)
    var kind: CodeKind

    @Timestamp(key: FieldKeys.expiresOn, on: .none)
    var expiresOn: Date?

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    init() { }

    init(id: String? = nil, kind: CodeKind, expiresOn: Date) {
        self.id = generateID(with: id)
        self.kind = kind
        self.expiresOn = expiresOn
    }
}

extension OneTimeCode {
    struct Create: AsyncMigration {
        typealias AccountKeys = Account.FieldKeys
        typealias OtpKeys = FieldKeys

        func prepare(on database: any Database) async throws {
            try await database.schema(OneTimeCode.schema)
                .field(OtpKeys.id, .string, .identifier(auto: false))
                .field(OtpKeys.accountID, .uuid, .required, .references(Account.schema, AccountKeys.id, onDelete: .cascade))
                .field(OtpKeys.used, .bool, .required, .sql(.default(false)))
                .field(OtpKeys.kind, .string, .required)
                .field(OtpKeys.expiresOn, .datetime, .required)
                .field(OtpKeys.createdAt, .datetime)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(OneTimeCode.schema).delete()
        }
    }

    enum CodeKind: String, Codable {
        case emailConfirmation = "EmailConfirmation"
        case passwordReset = "PasswordReset"
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let accountID: FieldKey = "account_id"
        static let used: FieldKey = "used"
        static let kind: FieldKey = "kind"
        static let expiresOn: FieldKey = "expires_on"
        static let createdAt: FieldKey = "created_at"
    }
}