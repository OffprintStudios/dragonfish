import Vapor
import Fluent
import JWT
import struct Foundation.UUID
import struct Foundation.Date

final class Session: Model, @unchecked Sendable {
    static let schema = "sessions"

    @ID(key: .id)
    var id: UUID?

    @Parent(key: FieldKeys.accountId)
    var account: Account

    @OptionalField(key: FieldKeys.ipAddr)
    var ipAddr: String?

    @OptionalField(key: FieldKeys.browser)
    var browser: String?

    @OptionalField(key: FieldKeys.os)
    var os: String?

    @Field(key: FieldKeys.expiresOn)
    var expiresOn: Date

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    init() { }

    init(id: UUID? = nil, ipAddr: String? = nil, browser: String? = nil, os: String? = nil, duration: Duration) {
        self.id = id
        self.ipAddr = ipAddr
        self.browser = browser
        self.os = os
        self.expiresOn = switch duration {
            case .long:
                Date().addingTimeInterval(LONG_SESSION)
            case .short:
                Date().addingTimeInterval(SHORT_SESSION)
        }
    }
}

extension Session {
    struct Create: AsyncMigration {
        typealias AccountKeys = Account.FieldKeys
        typealias SessionKeys = Session.FieldKeys

        func prepare(on database: any Database) async throws {
            try await database.schema(Session.schema)
                .id()
                .field(SessionKeys.accountId, .uuid, .required, .references(Account.schema, AccountKeys.id, onDelete: .cascade))
                .field(SessionKeys.ipAddr, .string)
                .field(SessionKeys.browser, .string)
                .field(SessionKeys.os, .string)
                .field(SessionKeys.expiresOn, .datetime, .required)
                .field(SessionKeys.createdAt, .datetime)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(Session.schema).delete()
        }
    }

    struct Token: Content, Authenticatable, JWTPayload {
        var expiration: ExpirationClaim
        var accountId: UUID
        var sessionId: UUID

        init(for account: Account, with session: Session, expiration: Date) throws {
            self.accountId = try account.requireID()
            self.sessionId = try session.requireID()
            self.expiration = ExpirationClaim(value: expiration)
        }

        func verify(using algorithm: some JWTAlgorithm) throws {
            try expiration.verifyNotExpired()
        }
    }

    enum Duration: String, Codable {
        case long = "long"
        case short = "short"
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let accountId: FieldKey = "account_id"
        static let ipAddr: FieldKey = "ip_addr"
        static let browser: FieldKey = "browser"
        static let os: FieldKey = "os"
        static let expiresOn: FieldKey = "expires_on"
        static let createdAt: FieldKey = "created_at"
    }
}