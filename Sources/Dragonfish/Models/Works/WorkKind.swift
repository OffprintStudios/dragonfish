import Vapor
import Fluent

enum WorkKind: String, Codable {
    static let schema = "work_kind"

    case prose = "Prose"
    case poetry = "Poetry"
    case script = "Script"
    case anthology = "Anthology"

    struct CreateEnum: AsyncMigration {
        func prepare(on database: any Database) async throws {
            _ = try await database.enum(schema)
                    .case(prose.rawValue)
                    .case(poetry.rawValue)
                    .case(script.rawValue)
                    .case(anthology.rawValue)
                    .create()
        }

        func revert(on database: any Database) async throws {
            try await database.enum(schema).delete()
        }
    }
}