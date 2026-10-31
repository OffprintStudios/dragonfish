-- Add up migration script here
CREATE TABLE IF NOT EXISTS blogs (
    id CHAR(21) PRIMARY KEY DEFAULT nanoid(),
    author_id CHAR(21) NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Blog (' || to_char(current_timestamp, 'MM-DD-YYYY') || ')',
    body TEXT DEFAULT NULL,
    word_count BIGINT NOT NULL GENERATED ALWAYS AS (
        CASE
            WHEN body IS NULL OR trim(body) = '' THEN 0
            ELSE array_length(regexp_split_to_array(trim(body), '\s+'), 1)
        END
    ) STORED,
    view_count BIGINT NOT NULL DEFAULT 0,
    cheer_count BIGINT NOT NULL DEFAULT 0,
    jeer_count BIGINT NOT NULL DEFAULT 0,
    rating content_rating NOT NULL,
    license content_license NOT NULL DEFAULT 'CC0',
    visibility content_visibility NOT NULL DEFAULT 'Private',
    allow_comments BOOLEAN NOT NULL DEFAULT TRUE,
    edited_on TIMESTAMPTZ DEFAULT NULL,
    published_on TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id CHAR(21) NOT NULL REFERENCES blogs (id) ON DELETE CASCADE,
    tag_id CHAR(21) NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    UNIQUE (blog_id, tag_id)
);

CREATE TABLE IF NOT EXISTS favorite_blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id CHAR(21) NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    blog_id CHAR(21) NOT NULL REFERENCES blogs (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    UNIQUE (profile_id, blog_id)
);

CREATE TABLE IF NOT EXISTS blog_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id CHAR(21) NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    blog_id CHAR(21) NOT NULL REFERENCES blogs (id) ON DELETE CASCADE,
    vote SMALLINT NOT NULL DEFAULT 0 CHECK (vote IN (-1, 0, 1)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    UNIQUE (profile_id, blog_id)
);

CREATE OR REPLACE FUNCTION update_blog_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Handle a brand new vote (INSERT)
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote = 1 THEN
            UPDATE blogs SET cheer_count = cheer_count + 1 WHERE id = NEW.blog_id;
        ELSIF NEW.vote = -1 THEN
            UPDATE blogs SET jeer_count = jeer_count + 1 WHERE id = NEW.blog_id;
        END IF;

    -- 2. Handle a user removing their vote (DELETE)
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote = 1 THEN
            UPDATE blogs SET cheer_count = cheer_count - 1 WHERE id = OLD.blog_id;
        ELSIF OLD.vote = -1 THEN
            UPDATE blogs SET jeer_count = jeer_count - 1 WHERE id = OLD.blog_id;
        END IF;

    -- 3. Handle a user changing their vote (UPDATE: e.g., Like to Dislike)
    ELSIF TG_OP = 'UPDATE' THEN
        -- If they changed a Like (1) to a Dislike (-1)
        IF OLD.vote = 1 AND NEW.vote = -1 THEN
            UPDATE blogs SET cheer_count = cheer_count - 1, jeer_count = jeer_count + 1 WHERE id = NEW.blog_id;
        -- If they changed a Dislike (-1) to a Like (1)
        ELSIF OLD.vote = -1 AND NEW.vote = 1 THEN
            UPDATE blogs SET cheer_count = cheer_count + 1, jeer_count = jeer_count - 1 WHERE id = NEW.blog_id;
        END IF;
    END IF;

    RETURN NULL; -- For AFTER triggers, returning NULL is standard
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON blog_votes
FOR EACH ROW
EXECUTE FUNCTION update_blog_vote_counts();

CREATE OR REPLACE VIEW blog_objects AS
SELECT
    b.id,
    p.id AS author_id,
    p.username AS author_name,
    p.avatar AS author_avatar,
    b.title,
    b.body,
    b.word_count,
    b.view_count,
    b.cheer_count,
    b.jeer_count,
    b.rating,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', t.id,
                'name', t."name",
                'desc', t."desc"
            )
        ) FILTER (WHERE t.id IS NOT NULL AND t.kind = 'Blog'),
        '[]'::jsonb
    ) AS tags,
    b.license,
    b.visibility,
    b.edited_on,
    b.published_on,
    b.created_at,
    b.updated_at
FROM blogs b
LEFT JOIN profiles p ON b.author_id = p.id
LEFT JOIN blog_tags bt ON b.id = bt.blog_id
LEFT JOIN tags t ON t.id = bt.tag_id
GROUP BY b.id, b.title, p.id;

CREATE OR REPLACE VIEW trending_blogs AS
SELECT
    b.id AS blog_id,
    b.view_count,
    COALESCE(SUM(bv.vote), 0)::INT AS net_votes,
    EXTRACT(EPOCH FROM (NOW() - b.published_on)) / 3600.0 AS age_in_hours
FROM blogs b
LEFT JOIN blog_votes bv ON b.id = bv.blog_id
WHERE b.published_on >= NOW() - INTERVAL '10 days' AND b.published_on <= NOW()
GROUP BY b.id;

CREATE INDEX IF NOT EXISTS blog_title_fts ON blogs USING GIN ((to_tsvector('english',title)));
CREATE INDEX IF NOT EXISTS blog_rating_idx ON blogs (rating);
CREATE INDEX IF NOT EXISTS blog_published_idx ON blogs (published_on);
CREATE INDEX IF NOT EXISTS blog_visibility_idx ON blogs (visibility);
CREATE INDEX IF NOT EXISTS blog_deleted_idx ON blogs (deleted_at);
