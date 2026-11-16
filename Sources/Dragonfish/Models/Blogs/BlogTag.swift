import Vapor
import Fluent
import struct Foundation.Date

final class BlogTag: Model, @unchecked Sendable {
    static let schema = "blog_tags"

    @ID(key: .id)
    var id: UUID?

    @Parent(key: FieldKeys.blogID)
    var blog: Blog

    @Parent(key: FieldKeys.tagID)
    var tag: Tag

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    init() { }
}

extension BlogTag {
    struct Create: AsyncMigration {
        func prepare(on database: any Database) async throws {
            try await database.schema(BlogTag.schema)
                .id()
                .field(FieldKeys.blogID, .string, .required, .references(Blog.schema, Blog.FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.tagID, .string, .required, .references(Tag.schema, Tag.FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.createdAt, .datetime)
                .unique(on: FieldKeys.blogID, FieldKeys.tagID)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(BlogTag.schema).delete()
        }
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let blogID: FieldKey = "blog_id"
        static let tagID: FieldKey = "tag_id"
        static let createdAt: FieldKey = "created_at"
    }
}