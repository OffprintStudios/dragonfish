-- Add up migration script here
CREATE TYPE content_rating AS ENUM ('Everyone', 'Teen', 'Mature', 'Explicit');

CREATE TYPE content_visibility AS ENUM ('Private', 'Profile', 'Public');

CREATE TYPE tag_kind AS ENUM ('Fandom', 'Warning', 'User');

CREATE TABLE IF NOT EXISTS tags (
    id CHAR(21) PRIMARY KEY DEFAULT nanoid(),
    "name" TEXT UNIQUE NOT NULL,
    "desc" TEXT DEFAULT NULL,
    parent_id CHAR(21) REFERENCES tags (id) ON DELETE CASCADE,
    kind tag_kind NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS tags_fts ON tags USING GIN ((to_tsvector('english',"name")));
SELECT manage_updated_at('tags');
