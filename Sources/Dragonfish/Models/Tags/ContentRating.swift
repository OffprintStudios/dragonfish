import Vapor
import Fluent

enum ContentRating: String, Codable {
    static let schema = "content_rating"

    case everyone = "Everyone"
    case teen = "Teen"
    case mature = "Mature"
    case explicit = "Explicit"

    struct CreateEnum: AsyncMigration {
        func prepare(on database: any Database) async throws {
            _ = try await database.enum(schema)
                    .case(everyone.rawValue)
                    .case(teen.rawValue)
                    .case(mature.rawValue)
                    .case(explicit.rawValue)
                    .create()
        }

        func revert(on database: any Database) async throws {
            try await database.enum(schema).delete()
        }
    }
}