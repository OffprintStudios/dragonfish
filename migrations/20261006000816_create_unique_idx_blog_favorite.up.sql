-- Add up migration script here
CREATE UNIQUE INDEX idx_unique_profile_favorite ON favorite_blogs (profile_id, blog_id);
