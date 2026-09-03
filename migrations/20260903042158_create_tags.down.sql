-- Add down migration script here
DROP INDEX IF EXISTS tags_fts;
DROP TABLE IF EXISTS tags;
DROP TYPE tag_kind;
DROP TYPE content_visibility;
DROP TYPE content_rating;
