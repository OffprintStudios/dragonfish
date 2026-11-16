import Vapor
import Fluent

enum CompletionStatus: String, Codable {
    static let schema = "completion_status"

    case cancelled = "Cancelled"
    case paused = "Paused"
    case incomplete = "Incomplete"
    case complete = "Complete"

    struct CreateEnum: AsyncMigration {
        func prepare(on database: any Database) async throws {
            _ = try await database.enum(schema)
                    .case(cancelled.rawValue)
                    .case(paused.rawValue)
                    .case(incomplete.rawValue)
                    .case(complete.rawValue)
                    .create()
        }

        func revert(on database: any Database) async throws {
            try await database.enum(schema).delete()
        }
    }
}