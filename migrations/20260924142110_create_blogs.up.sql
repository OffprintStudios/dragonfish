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
    rating content_rating NOT NULL,
    license content_license NOT NULL DEFAULT 'CC0',
    visibility content_visibility NOT NULL DEFAULT 'Private',
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS blog_title_fts ON blogs USING GIN ((to_tsvector('english',title)));
CREATE INDEX IF NOT EXISTS blog_rating_idx ON blogs (rating);
CREATE INDEX IF NOT EXISTS blog_published_idx ON blogs (published_on);
CREATE INDEX IF NOT EXISTS blog_visibility_idx ON blogs (visibility);
CREATE INDEX IF NOT EXISTS blog_deleted_idx ON blogs (deleted_at);
