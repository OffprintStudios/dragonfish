import Vapor
import Fluent
import FluentSQL
import struct Foundation.Date

final class BlogVote: Model, @unchecked Sendable {
    static let schema = "blog_votes"

    @ID(key: .id)
    var id: UUID?

    @Parent(key: FieldKeys.profileID)
    var profile: Profile

    @Parent(key: FieldKeys.blogID)
    var blog: Blog

    @Field(key: FieldKeys.vote)
    var vote: VoteValue

    @Timestamp(key: FieldKeys.createdAt, on: .create)
    var createdAt: Date?

    init() { }

    init(id: UUID? = nil, profileID: String, blogID: String, vote: VoteValue) {
        self.id = id
        self.$profile.id = profileID
        self.$blog.id = blogID
        self.vote = vote
    }
}

extension BlogVote {
    struct Create: AsyncMigration {
        func prepare(on database: any Database) async throws {
            try await database.schema(BlogVote.schema)
                .id()
                .field(FieldKeys.profileID, .string, .required, .references(Profile.schema, Profile.FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.blogID, .string, .required, .references(Blog.schema, Blog.FieldKeys.id, onDelete: .cascade))
                .field(FieldKeys.vote, .int16, .required, .sql(.default(0)))
                .field(FieldKeys.createdAt, .datetime)
                .create()

            guard let sql = database as? any SQLDatabase else { 
                fatalError("Database does not support raw SQL execution.")
            }
            try await sql.raw("ALTER TABLE blog_votes ADD CONSTRAINT blog_vote_range_check CHECK (vote IN (-1, 0, 1));").run()
        }   

        func revert(on database: any Database) async throws {
            try await database.schema(BlogVote.schema).delete()
        }
    }

    struct CreateTrigger: AsyncMigration {
        func prepare(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else {
                fatalError("Database does not support raw SQL execution")
            }

            try await sql.raw("""
                CREATE OR REPLACE FUNCTION update_blog_vote_counts()
                RETURNS TRIGGER AS $$
                BEGIN
                    -- 1. Handle a brand new vote (INSERT)
                    IF TG_OP = 'INSERT' THEN
                        IF NEW.vote = 1 THEN
                            UPDATE blogs SET likes = likes + 1 WHERE id = NEW.blog_id;
                        ELSIF NEW.vote = -1 THEN
                            UPDATE blogs SET dislikes = dislikes + 1 WHERE id = NEW.blog_id;
                        END IF;

                    -- 2. Handle a user removing their vote (DELETE)
                    ELSIF TG_OP = 'DELETE' THEN
                        IF OLD.vote = 1 THEN
                            UPDATE blogs SET likes = likes - 1 WHERE id = OLD.blog_id;
                        ELSIF OLD.vote = -1 THEN
                            UPDATE blogs SET dislikes = dislikes - 1 WHERE id = OLD.blog_id;
                        END IF;

                    -- 3. Handle a user changing their vote (UPDATE: e.g., Like to Dislike)
                    ELSIF TG_OP = 'UPDATE' THEN
                        -- If they changed a Like (1) to a Dislike (-1)
                        IF OLD.vote = 1 AND NEW.vote = -1 THEN
                            UPDATE blogs SET likes = likes - 1, dislikes = dislikes + 1 WHERE id = NEW.blog_id;
                        -- If they changed a Dislike (-1) to a Like (1)
                        ELSIF OLD.vote = -1 AND NEW.vote = 1 THEN
                            UPDATE blogs SET likes = likes + 1, dislikes = dislikes - 1 WHERE id = NEW.blog_id;
                        END IF;
                    END IF;

                    RETURN NULL; -- For AFTER triggers, returning NULL is standard
                END;
                $$ LANGUAGE plpgsql;
            """).run()

            try await sql.raw("""
                CREATE TRIGGER trigger_update_blog_vote_counts
                AFTER INSERT OR UPDATE OR DELETE ON blog_votes
                FOR EACH ROW
                EXECUTE FUNCTION update_blog_vote_counts();
            """).run()
        }

        func revert(on database: any Database) async throws {
            guard let sql = database as? any SQLDatabase else { return }

            try await sql.raw("DROP TRIGGER IF EXISTS trigger_update_blog_vote_counts ON users;").run()
            try await sql.raw("DROP FUNCTION IF EXISTS update_blog_vote_counts();").run()
        }
    }

    enum VoteValue: Int16, Codable {
        case like = 1
        case none = 0
        case dislike = -1
    }

    enum FieldKeys {
        static let id: FieldKey = "id"
        static let profileID: FieldKey = "profile_id"
        static let blogID: FieldKey = "blog_id"
        static let vote: FieldKey = "vote"
        static let createdAt: FieldKey = "created_at"
    }
}