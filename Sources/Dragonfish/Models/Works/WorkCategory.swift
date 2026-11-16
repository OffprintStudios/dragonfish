import Vapor
import Fluent

enum WorkCategory: String, Codable {
    static let schema = "work_category"

    case original = "Original"
    case fanwork = "Fanwork"

    struct CreateEnum: AsyncMigration {
        func prepare(on database: any Database) async throws {
            _ = try await database.enum(schema)
                    .case(original.rawValue)
                    .case(fanwork.rawValue)
                    .create()
        }

        func revert(on database: any Database) async throws {
            try await database.enum(schema).delete()
        }
    }
}
