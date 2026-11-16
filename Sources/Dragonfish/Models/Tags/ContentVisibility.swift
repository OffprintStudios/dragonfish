import Vapor
import Fluent

enum ContentVisibility: String, Codable {
    static let schema = "content_visibility"

    case `private` = "Private"
    case profile = "Profile"
    case `public` = "Public"

    struct CreateEnum: AsyncMigration {
        func prepare(on database: any Database) async throws {
            _ = try await database.enum(schema)
                    .case(`private`.rawValue)
                    .case(profile.rawValue)
                    .case(`public`.rawValue)
                    .create()
        }

        func revert(on database: any Database) async throws {
            try await database.enum(schema).delete()
        }
    }
}