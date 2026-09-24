-- Add down migration script here
DROP INDEX IF EXISTS blog_deleted_idx;
DROP INDEX IF EXISTS blog_visibility_idx;
DROP INDEX IF EXISTS blog_published_idx;
DROP INDEX IF EXISTS blog_rating_idx;
DROP INDEX IF EXISTS blog_title_fts;

DROP TABLE IF EXISTS favorite_blogs;
DROP TABLE IF EXISTS blog_tags;
DROP TABLE IF EXISTS blogs;
