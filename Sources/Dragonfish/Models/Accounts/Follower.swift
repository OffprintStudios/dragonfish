import Vapor
import Fluent
import SwiftSoup
import struct Foundation.Date

final class Follower: Model, @unchecked Sendable {
    static let schema = "followers"

    @ID(key: .id)
    var id: UUID?

    @Parent(key: FieldKeys.profileID)
    var profile: Profile

    @Parent(key: FieldKeys.subscribedTo)
    var subscribedTo: Profile

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    init() { }
}

extension Follower {
    struct Create: AsyncMigration {
        typealias ProfileKeys = Profile.FieldKeys
        typealias FollowerKeys = Follower.FieldKeys

        func prepare(on database: any Database) async throws {
            try await database.schema(Follower.schema)
                .id()
                .field(FollowerKeys.profileID, .string, .required, .references(Profile.schema, ProfileKeys.id, onDelete: .cascade))
                .field(FollowerKeys.subscribedTo, .string, .required, .references(Profile.schema, ProfileKeys.id, onDelete: .cascade))
                .field(FollowerKeys.createdAt, .datetime)
                .unique(on: FieldKeys.profileID, FieldKeys.subscribedTo)
                .create()
        }

        func revert(on database: any Database) async throws {
            try await database.schema(Follower.schema).delete()
        }
    }

    struct Middleware: AsyncModelMiddleware {
        func create(model: Follower, on db: any Database, next: any AnyAsyncModelResponder) async throws {
            model.$subscribedTo.id = try SwiftSoup.clean(model.$subscribedTo.id, .none())!
            
            if try await Profile.query(on: db).filter(\.$id == model.$subscribedTo.id).first() == nil {
                throw Abort(.expectationFailed, reason: "Not a valid ID!")
            }

            return try await next.create(model, on: db)
        }
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let profileID: FieldKey = "profileID"
        static let subscribedTo: FieldKey = "subscribed_to"
        static let createdAt: FieldKey = "created_at"
    }
}