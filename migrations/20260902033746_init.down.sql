-- Add down migration script here
DROP FUNCTION IF EXISTS nanoid(int, text, float);
DROP FUNCTION IF EXISTS nanoid_optimized(int, text, int, int);

DROP EXTENSION IF EXISTS "pgcrypto";

DROP FUNCTION IF EXISTS manage_updated_at(_tbl regclass);
DROP FUNCTION IF EXISTS set_updated_at();
