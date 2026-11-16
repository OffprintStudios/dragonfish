import Vapor
import Fluent
import SQLKit
import NanoID
import SwiftSoup
import struct Foundation.Date

final class Profile: Model, @unchecked Sendable {
    static let schema = "profiles"

    @ID(custom: FieldKey.id, generatedBy: .user)
    var id: String?

    @Parent(key: FieldKeys.accountID)
    var account: Account

    @Field(key: FieldKeys.username)
    var username: String

    @Field(key: FieldKeys.avatar)
    var avatar: String

    @OptionalField(key: FieldKeys.bannerArt)
    var bannerArt: String?

    @Field(key: FieldKeys.bio)
    var bio: String

    @Field(key: FieldKeys.tagline)
    var tagline: String

    @Field(key: FieldKeys.links)
    var links: [String]

    @Siblings(through: ProfileBadge.self, from: \.$profile, to: \.$badge)
    var badges: [Badge]

    @Children(for: \.$author)
    var blogs: [Blog]

    @Siblings(through: FavoriteBlog.self, from: \.$profile, to: \.$blog)
    var favoriteBlogs: [Blog]

    @Siblings(through: Follower.self, from: \.$profile, to: \.$subscribedTo)
    var following: [Profile]

    @Siblings(through: Follower.self, from: \.$subscribedTo, to: \.$profile)
    var followers: [Profile]

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    @Timestamp(key: FieldKeys.updatedAt, on: .update)
    var updatedAt: Date?

    @Timestamp(key: FieldKeys.deletedAt, on: .delete)
    var deletedAt: Date?

    init() { }

    init(id: String? = nil, from formData: FormInfo) {
        self.id = generateID(with: id)
        self.username = formData.username
        self.avatar = "https://images.offprint.net/avatars/avatar.png"
        self.bannerArt = nil
        self.bio = "Just another friendly face"
        self.tagline = "Patron"
        self.links = []
    }

    func toObject() -> ProfileObject {
        .init(
            id: self.id, 
            username: self.$username.value!, 
            avatar: self.$avatar.value!, 
            bannerArt: self.$bannerArt.value!, 
            bio: self.$bio.value!, 
            tagline: self.$tagline.value!,
            works: 0, 
            blogs: 0, 
            followers: 0, 
            following: 0, 
            links: self.$links.value!, 
            createdAt: self.$createdAt.value!
        )
    }
}

extension Profile {
    struct Create: AsyncMigration {
        typealias AccountKeys = Account.FieldKeys
        typealias ProfileKeys = FieldKeys

        func prepare(on database: any Database) async throws {
            try await database.schema(Profile.schema)
                .field(ProfileKeys.id, .string, .identifier(auto: false))
                .field(ProfileKeys.accountID, .uuid, .required, .references(Account.schema, AccountKeys.id, onDelete: .cascade))
                .field(ProfileKeys.username, .string, .required)
                .field(ProfileKeys.avatar, .string, .required)
                .field(ProfileKeys.bannerArt, .string)
                .field(ProfileKeys.bio, .string)
                .field(ProfileKeys.tagline, .string)
                .field(ProfileKeys.links, .array(of: .string), .required)
                .field(ProfileKeys.createdAt, .datetime)
                .field(ProfileKeys.updatedAt, .datetime)
                .field(ProfileKeys.deletedAt, .datetime)
                .unique(on: ProfileKeys.username)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(Profile.schema).delete()
        }
    }

    struct CreateIndexes: AsyncMigration {
        func prepare(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else {
                fatalError("Failed to initialize SQL driver.")
            }

            try await sql.raw("CREATE INDEX IF NOT EXISTS profile_name_fts ON profiles USING GIN ((to_tsvector('english', \"username\")));").run()
        }

        func revert(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else {
                return
            }

            try await sql.raw("DROP INDEX IF EXISTS profile_name_fts;").run()
        }
    }

    struct Middleware: AsyncModelMiddleware {
        func create(model: Profile, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.username = try SwiftSoup.clean(model.username, .none())!

            if try await Profile.query(on: db).filter(\.$username == model.username).first() != nil {
                throw Abort(.conflict, reason: "The username you want has already been taken.")
            }

            model.bio = try SwiftSoup.clean(model.bio, .none())!
            model.tagline = try SwiftSoup.clean(model.tagline, .none())!
            return try await next.create(model, on: db)
        }

        func update(model: Profile, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.username = try SwiftSoup.clean(model.username, .none())!

            if try await Profile.query(on: db).filter(\.$username == model.username).first() != nil {
                throw Abort(.conflict, reason: "The username you want has already been taken.")
            }

            model.bio = try SwiftSoup.clean(model.bio, .none())!
            model.tagline = try SwiftSoup.clean(model.tagline, .none())!

            var sanitizedLinks: [String] = []
            for i in 0..<model.links.count {
                let sanitizedValue = try SwiftSoup.clean(model.links[i], .none())!
                sanitizedLinks.append(sanitizedValue)
            }
            model.links = sanitizedLinks

            return try await next.update(model, on: db)
        }
    }

    struct FormInfo: Content, Validatable {
        var username: String
        var bio: String?
        var tagline: String?
        var links: [String]

        static func validations(_ validations: inout Validations) {
            validations.add(
                "username", 
                as: String.self, 
                is: .count(3...32), 
                required: true, 
                customFailureDescription: "Your username should be between 3 and 32 characters long."
            )
            validations.add(
                "bio", 
                as: String.self, 
                is: .count(3...120), 
                required: false, 
                customFailureDescription: "Your profile bio should be between 3 and 120 characters long."
            )
            validations.add(
                "tagline", 
                as: String.self, 
                is: .count(3...32), required: false, 
                customFailureDescription: "Taglines should be between 3 and 32 characters long."
            )
        }
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let accountID: FieldKey = "account_id"
        static let username: FieldKey = "username"
        static let avatar: FieldKey = "avatar"
        static let bannerArt: FieldKey = "banner_art"
        static let bio: FieldKey = "bio"
        static let tagline: FieldKey = "tagline"
        static let links: FieldKey = "links"
        static let presence: FieldKey = "presence"
        static let createdAt: FieldKey = "created_at"
        static let updatedAt: FieldKey = "updated_at"
        static let deletedAt: FieldKey = "deleted_at"
    }
}