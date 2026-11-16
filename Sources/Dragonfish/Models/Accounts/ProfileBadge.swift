import Vapor
import Fluent
import struct Foundation.Date

final class ProfileBadge: Model, @unchecked Sendable {
    static let schema = "profile_badges"

    @ID(key: .id)
    var id: UUID?

    @Parent(key: FieldKeys.badgeID)
    var badge: Badge

    @Parent(key: FieldKeys.profileID)
    var profile: Profile

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    init() { }
}

extension ProfileBadge {
    struct Create: AsyncMigration {
        func prepare(on database: any Database) async throws {
            try await database.schema(ProfileBadge.schema)
                .id()
                .field(FieldKeys.badgeID, .string, .required, .references(Badge.schema, Badge.FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.profileID, .string, .required, .references(Profile.schema, Profile.FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.createdAt, .datetime)
                .unique(on: FieldKeys.badgeID, FieldKeys.profileID)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(ProfileBadge.schema).delete()
        }
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let badgeID: FieldKey = "badge_id"
        static let profileID: FieldKey = "profile_id"
        static let createdAt: FieldKey = "created_at"
    }
}