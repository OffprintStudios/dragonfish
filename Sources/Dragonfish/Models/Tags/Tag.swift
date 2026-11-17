import Vapor
import Fluent
import SQLKit
import NanoID
import SwiftSoup
import struct Foundation.Date

final class Tag: Model, @unchecked Sendable {
    static let schema = "tags"

    @ID(custom: FieldKeys.id, generatedBy: .user)
    var id: String?

    @Field(key: FieldKeys.name)
    var name: String

    @OptionalField(key: FieldKeys.description)
    var description: String?

    @OptionalParent(key: FieldKeys.parentID)
    var parent: Tag?

    @Children(for: \.$parent)
    var children: [Tag]

    @Field(key: FieldKeys.kind)
    var kind: TagKind

    @Siblings(through: BlogTag.self, from: \.$tag, to: \.$blog)
    var blogs: [Blog]

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    @Timestamp(key: FieldKeys.updatedAt, on: .update)
    var updatedAt: Date?

    init() { }

    init(id: String? = nil, from formData: FormInfo) {
        self.id = generateID(with: id)
        self.name = formData.name
        self.description = formData.desc
        self.$parent.id = formData.parentId
        self.kind = formData.kind
    }
}

extension Tag {
    struct Create: AsyncMigration {
        func prepare(on database: any Database) async throws {
            try await database.schema(Tag.schema)
                .field(FieldKeys.id, .string, .identifier(auto: false))
                .field(FieldKeys.name, .string, .required)
                .field(FieldKeys.description, .string)
                .field(FieldKeys.parentID, .string, .references(Tag.schema, FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.kind, .string, .required)
                .field(FieldKeys.createdAt, .datetime)
                .field(FieldKeys.updatedAt, .datetime)
                .unique(on: FieldKeys.name)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(Tag.schema).delete()
        }
    }

    struct CreateIndexes: AsyncMigration {
        func prepare(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else {
                fatalError("Failed to initialize SQL driver.")
            }

            try await sql.raw("CREATE INDEX IF NOT EXISTS tags_fts ON tags USING GIN ((to_tsvector('english',\"name\")));").run()
            try await sql.raw("CREATE INDEX IF NOT EXISTS tag_kind_idx ON tags (kind);").run()
        }

        func revert(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else {
                return
            }

            try await sql.raw("DROP INDEX IF EXISTS tags_fts;").run()
            try await sql.raw("DROP INDEX IF EXISTS tag_kind_idx;").run()
        }
    }

    struct Middleware: AsyncModelMiddleware {
        func create(model: Tag, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.name = try SwiftSoup.clean(model.name, .none())!
            if try await Tag.query(on: db).filter(\.$name == model.name).first() != nil {
                throw Abort(.conflict, reason: "The name you want has already been taken.")
            }

            if let desc = model.description {
                model.description = try SwiftSoup.clean(desc, .none())!
            }

            return try await next.create(model, on: db)
        }

        func update(model: Tag, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.name = try SwiftSoup.clean(model.name, .none())!
            if try await Tag.query(on: db).filter(\.$name == model.name).first() != nil {
                throw Abort(.conflict, reason: "The name you want has already been taken.")
            }

            if let desc = model.description {
                model.description = try SwiftSoup.clean(desc, .none())!
            }
            
            return try await next.update(model, on: db)
        }
    }

    struct FormInfo: Content, Validatable {
        var name: String
        var desc: String?
        var parentId: Tag.IDValue?
        var kind: TagKind

        static func validations(_ validations: inout Validations) {
            validations.add(
                "name", 
                as: String.self, 
                is: .count(3...120), 
                required: true, 
                customFailureDescription: "Tag names should be between 3 and 120 characters long."
            )
            validations.add(
                "desc",
                as: String.self,
                is: .count(3...240),
                required: false,
                customFailureDescription: "Tag descriptions should be between 3 and 240 characters long."
            )
            validations.add(
                "kind",
                as: String.self,
                is: .in(TagKind.allCases.map(\.rawValue)),
                required: true
            )
        }
    }

    enum TagKind: String, Codable, CaseIterable {
        case fandom = "Fandom"
        case warning = "Warning"
        case user = "User"
        case blog = "Blog"
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let name: FieldKey = "name"
        static let description: FieldKey = "description"
        static let parentID: FieldKey = "parent_id"
        static let kind: FieldKey = "kind"
        static let createdAt: FieldKey = "created_at"
        static let updatedAt: FieldKey = "updated_at"
    }
}