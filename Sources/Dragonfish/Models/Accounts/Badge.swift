import Vapor
import Fluent
import SwiftSoup
import struct Foundation.Date

final class Badge: Model, @unchecked Sendable {
    static let schema = "badges"

    @ID(custom: FieldKeys.id, generatedBy: .user)
    var id: String?

    @Field(key: FieldKeys.name)
    var name: String

    @Field(key: FieldKeys.description)
    var description: String

    @Field(key: FieldKeys.iconURL)
    var iconURL: String

    @Siblings(through: ProfileBadge.self, from: \.$badge, to: \.$profile)
    var profiles: [Profile]

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    @Timestamp(key: FieldKeys.updatedAt, on: .update)
    var updatedAt: Date?

    init() { }

    init(id: String? = nil, with formInfo: FormData, iconURL: String) {
        self.id = generateID(with: id)
        self.name = formInfo.name
        self.description = formInfo.description
        self.iconURL = iconURL
    }
}

extension Badge {
    struct Create: AsyncMigration {
        func prepare(on database: any Database) async throws {
            try await database.schema(Badge.schema)
                .field(FieldKeys.id, .string, .identifier(auto: false))
                .field(FieldKeys.name, .string, .required)
                .field(FieldKeys.description, .string, .required)
                .field(FieldKeys.iconURL, .string, .required)
                .field(FieldKeys.createdAt, .datetime)
                .field(FieldKeys.updatedAt, .datetime)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(Badge.schema).delete()
        }
    }

    struct Middleware: AsyncModelMiddleware {
        func create(model: Badge, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.name = try SwiftSoup.clean(model.name, .none())!
            model.description = try SwiftSoup.clean(model.description, .none())!
            return try await next.create(model, on: db)
        }

        func update(model: Badge, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.name = try SwiftSoup.clean(model.name, .none())!
            model.description = try SwiftSoup.clean(model.description, .none())!
            return try await next.update(model, on: db)
        }
    }

    struct FormData: Content, Validatable {
        var name: String
        var description: String

        static func validations(_ validations: inout Validations) {
            validations.add(
                "name",
                as: String.self,
                is: .count(3...32),
                required: true,
                customFailureDescription: "Badge names should be between 3 and 32 characters."
            )
            validations.add(
                "description",
                as: String.self,
                is: .count(3...120),
                required: true,
                customFailureDescription: "Badge descriptions should be between 3 and 120 characters."
            )
        }
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let name: FieldKey = "name"
        static let description: FieldKey = "description"
        static let iconURL: FieldKey = "icon_url"
        static let createdAt: FieldKey = "created_at"
        static let updatedAt: FieldKey = "updated_at"
    }
}