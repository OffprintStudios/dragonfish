import Vapor
import Fluent

enum ApprovalStatus: String, Codable {
    static let schema = "approval_status"

    case notSubmitted = "NotSubmitted"
    case pending = "Pending"
    case rejected = "Rejected"
    case approved = "Approved"

    struct CreateEnum: AsyncMigration {
        func prepare(on database: any Database) async throws {
            _ = try await database.enum(schema)
                    .case(notSubmitted.rawValue)
                    .case(pending.rawValue)
                    .case(rejected.rawValue)
                    .case(approved.rawValue)
                    .create()
        }

        func revert(on database: any Database) async throws {
            try await database.enum(schema).delete()
        }
    }
}