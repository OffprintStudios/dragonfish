import Vapor
import Fluent
import FluentSQL
import struct Foundation.Date

final class TrendingBlog: Model, @unchecked Sendable {
    static let schema = "trending_blogs"

    @ID(custom: FieldKeys.id, generatedBy: .user)
    var id: String?

    @Field(key: FieldKeys.views)
    var views: Int64

    @Field(key: FieldKeys.netVotes)
    var netVotes: Int64

    @Timestamp(key: FieldKeys.ageInHours, on: .none)
    var ageInHours: Date?

    init() { }
}

extension TrendingBlog {
    struct CreateView: AsyncMigration {
        func prepare(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else { 
                fatalError("Database does not support raw SQL execution.")
            }

            try await sql.raw("""
                CREATE OR REPLACE VIEW \(unsafeRaw: TrendingBlog.schema) AS
                SELECT
                    b.id AS id,
                    b.views,
                    COALESCE(SUM(bv.vote), 0)::BIGINT AS net_votes,
                    EXTRACT(EPOCH FROM (NOW() - b.published_on)) / 3600.0 AS age_in_hours
                FROM blogs b
                LEFT JOIN blog_votes bv ON b.id = bv.blog_id
                WHERE b.published_on >= NOW() - INTERVAL '10 days' AND b.published_on <= NOW()
                GROUP BY b.id;
            """).run()
        }

        func revert(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else { return }
            try await sql.raw("DROP VIEW IF EXISTS \(unsafeRaw: TrendingBlog.schema);").run()
        }
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let views: FieldKey = "views"
        static let netVotes: FieldKey = "net_votes"
        static let ageInHours: FieldKey = "age_in_hours"
    }
}