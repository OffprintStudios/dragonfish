import Vapor
import Fluent

enum ContentLicense: String, Codable {
    static let schema = "content_license"

    /// Allows remixing and commercial use so long as attribution is given to the original author(s).
    case ccby = "CCBY"
    /// Allows remixing and commercial use so long as attribution is given to the original author(s),
    /// and subsequent derivative works are licensed under the same terms. 
    case ccbysa = "CCBYSA"
    /// Allows remixing so long as attribution is given to the original author(s), but disallows 
    /// commercial use.   
    case ccbync = "CCBYNC"
    /// Allows remixing so long as attribution is given to the original author(s), but disallows 
    /// commercial use. All subsequent derivative works must be licensed under the same terms. 
    case ccbyncsa = "CCBYNCSA"
    /// Allows commercial use, but only in an unmodified or unadapted form, with credit given to the 
    /// original author(s).
    case ccbynd = "CCBYND"
    /// This work cannot be modified or adapted and cannot be used commercially, with credit given to 
    /// the original author(s).
    case ccbyncnd = "CCBYNCND"
    /// All legal rights waived. This work can be shared, remixed, and distributed in any fashion 
    /// with or without attribution, with zero conditions.
    case cc0 = "CC0"

    struct CreateEnum: AsyncMigration {
        func prepare(on database: any Database) async throws {
            _ = try await database.enum(schema)
                    .case(ccby.rawValue)
                    .case(ccbysa.rawValue)
                    .case(ccbync.rawValue)
                    .case(ccbyncsa.rawValue)
                    .case(ccbynd.rawValue)
                    .case(ccbyncnd.rawValue)
                    .case(cc0.rawValue)
                    .create()
        }

        func revert(on database: any Database) async throws {
            try await database.enum(schema).delete()
        }
    }
}