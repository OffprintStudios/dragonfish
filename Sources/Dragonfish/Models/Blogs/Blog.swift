import Vapor
import Fluent
import FluentSQL
import SwiftSoup
import struct Foundation.Date

final class Blog: Model, @unchecked Sendable {
    static let schema = "blogs"

    @ID(custom: FieldKeys.id, generatedBy: .user)
    var id: String?

    @Parent(key: FieldKeys.authorID)
    var author: Profile

    @Field(key: FieldKeys.title)
    var title: String

    @Field(key: FieldKeys.body)
    var body: String

    @Siblings(through: BlogTag.self, from: \.$blog, to: \.$tag)
    var tags: [Tag]

    @Field(key: FieldKeys.words)
    var words: Int64

    @Field(key: FieldKeys.views)
    var views: Int64

    @Field(key: FieldKeys.likes)
    var likes: Int64

    @Field(key: FieldKeys.dislikes)
    var dislikes: Int64

    @Siblings(through: FavoriteBlog.self, from: \.$blog, to: \.$profile)
    var favoritedBy: [Profile]

    @Field(key: FieldKeys.nsfw)
    var nsfw: Bool

    @Enum(key: FieldKeys.license)
    var license: ContentLicense

    @Enum(key: FieldKeys.visibility)
    var visibility: ContentVisibility

    @Field(key: FieldKeys.allowComments)
    var allowComments: Bool

    @Timestamp(key: FieldKeys.editedOn, on: .none)
    var editedOn: Date?

    @Timestamp(key: FieldKeys.publishedOn, on: .none)
    var publishedOn: Date?

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    @Timestamp(key: FieldKeys.updatedAt, on: .update)
    var updatedAt: Date?

    @Timestamp(key: FieldKeys.deletedAt, on: .delete)
    var deletedAt: Date?

    init() { }

    init(id: String? = nil, from formData: FormInfo) {
        self.id = generateID(with: id)
        self.title = formData.title
        self.body = formData.body
    }

    func toObject() -> BlogObject{
        .init(
            id: self.id,
            authorID: self.$author.id,
            authorName: self.author.username,
            authorAvatar: self.author.avatar,
            title: self.title,
            body: self.body,
            words: self.words,
            views: self.views,
            likes: self.likes,
            dislikes: self.dislikes,
            nsfw: self.nsfw,
            license: self.license,
            allowComments: self.allowComments,
            editedOn: self.editedOn,
            publishedOn: self.publishedOn,
            createdAt: self.createdAt,
            updatedAt: self.updatedAt
        )
    }
}

extension Blog {
    struct Create: AsyncMigration {
        typealias ProfileKeys = Profile.FieldKeys
        typealias BlogKeys = Blog.FieldKeys

        func prepare(on database: any Database) async throws {
            let licenseType = try await database.enum(ContentLicense.schema).read()
            let visibilityType = try await database.enum(ContentVisibility.schema).read()

            try await database.schema(Blog.schema)
                .field(BlogKeys.id, .string, .identifier(auto: false))
                .field(BlogKeys.authorID, .string, .required, .references(Profile.schema, ProfileKeys.id, onDelete: .cascade))
                .field(BlogKeys.title, .string, .required)
                .field(BlogKeys.body, .string, .required)
                .field(BlogKeys.words, .int64, .required, .sql(.default(0)))
                .field(BlogKeys.views, .int64, .required, .sql(.default(0)))
                .field(BlogKeys.likes, .int64, .required, .sql(.default(0)))
                .field(BlogKeys.dislikes, .int64, .required, .sql(.default(0)))
                .field(BlogKeys.nsfw, .bool, .required, .sql(.default(false)))
                .field(BlogKeys.license, licenseType, .required)
                .field(BlogKeys.visibility, visibilityType, .required)
                .field(BlogKeys.allowComments, .bool, .required, .sql(.default(true)))
                .field(BlogKeys.editedOn, .datetime)
                .field(BlogKeys.publishedOn, .datetime)
                .field(BlogKeys.createdAt, .datetime)
                .field(BlogKeys.updatedAt, .datetime)
                .field(BlogKeys.deletedAt, .datetime)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(Blog.schema).delete()
        }
    }

    struct CreateIndexes: AsyncMigration {
        func prepare(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else { 
                fatalError("Database does not support raw SQL execution.")
            }

            try await sql.raw("CREATE INDEX IF NOT EXISTS blog_title_fts ON blogs USING GIN ((to_tsvector('english',title)));").run()
            try await sql.raw("CREATE INDEX IF NOT EXISTS blog_nsfw_idx ON blogs (nsfw);").run()
            try await sql.raw("CREATE INDEX IF NOT EXISTS blog_published_idx ON blogs (published_on);").run()
            try await sql.raw("CREATE INDEX IF NOT EXISTS blog_visibility_idx ON blogs (visibility);").run()
            try await sql.raw("CREATE INDEX IF NOT EXISTS blog_deleted_idx ON blogs (deleted_at);").run()
        }

        func revert(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else { return }

            try await sql.raw("DROP INDEX IF EXITS blog_deleted_idx;").run()
            try await sql.raw("DROP INDEX IF EXISTS blog_visibility_idx;").run()
            try await sql.raw("DROP INDEX IF EXISTS blog_published_idx;").run()
            try await sql.raw("DROP INDEX IF EXISTS blog_nsfw_idx;").run()
            try await sql.raw("DROP INDEX IF EXISTS blog_title_fts;").run()
        }
    }

    struct Middleware: AsyncModelMiddleware {
        func create(model: Blog, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.title = try SwiftSoup.clean(model.title, .none())!
            model.body = try SwiftSoup.clean(model.body, .none())!
            model.words = try countWords(of: model.body)
            model.license = .ccby
            model.visibility = .private
            return try await next.create(model, on: db)
        }

        func update(model: Blog, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.title = try SwiftSoup.clean(model.title, .none())!
            model.body = try SwiftSoup.clean(model.body, .none())!
            model.words = try countWords(of: model.body)
            return try await next.update(model, on: db)
        }
    }

    struct FormInfo: Content, Validatable {
        var title: String
        var body: String

        static func validations(_ validations: inout Validations) {
            validations.add(
                "title",
                as: String.self,
                is: .count(3...72),
                required: true,
                customFailureDescription: "Blog titles should be between 3 and 72 characters long."
            )
            validations.add(
                "body",
                as: String.self,
                is: .count(3...),
                required: true,
                customFailureDescription: "Blogs must be at least 3 characters long."
            )
        }
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let authorID: FieldKey = "author_id"
        static let title: FieldKey = "title"
        static let body: FieldKey = "body"
        static let words: FieldKey = "words"
        static let views: FieldKey = "views"
        static let likes: FieldKey = "likes"
        static let dislikes: FieldKey = "dislikes"
        static let nsfw: FieldKey = "nsfw"
        static let license: FieldKey = "license"
        static let visibility: FieldKey = "visibility"
        static let allowComments: FieldKey = "allow_comments"
        static let editedOn: FieldKey = "edited_on"
        static let publishedOn: FieldKey = "published_on"
        static let createdAt: FieldKey = "created_at"
        static let updatedAt: FieldKey = "updated_at"
        static let deletedAt: FieldKey = "deleted_at"
    }
}