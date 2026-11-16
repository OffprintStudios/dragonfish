import Vapor
import Fluent
import struct Foundation.Date

final class FavoriteBlog: Model, @unchecked Sendable {
    static let schema = "favorite_blogs"

    @ID(key: .id)
    var id: UUID?

    @Parent(key: FieldKeys.profileID)
    var profile: Profile

    @Parent(key: FieldKeys.blogID)
    var blog: Blog

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    init() { }
}

extension FavoriteBlog {
    struct Create: AsyncMigration {
        func prepare(on database: any Database) async throws {
            try await database.schema(FavoriteBlog.schema)
                .id()
                .field(FieldKeys.profileID, .string, .required, .references(Profile.schema, Profile.FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.blogID, .string, .required, .references(Blog.schema, Blog.FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.createdAt, .datetime)
                .unique(on: FieldKeys.profileID, FieldKeys.blogID)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(FavoriteBlog.schema).delete()
        }
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let profileID: FieldKey = "profile_id"
        static let blogID: FieldKey = "blog_id"
        static let createdAt: FieldKey = "created_at"
    }
}