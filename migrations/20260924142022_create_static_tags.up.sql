-- Add up migration script here
CREATE TYPE category AS ENUM ('Original', 'Fanwork');

CREATE TYPE work_kind AS ENUM ('Prose', 'Poetry', 'Script', 'Anthology');

CREATE TYPE completion_status AS ENUM ('Cancelled', 'Paused', 'Incomplete', 'Complete');

CREATE TYPE approval_status AS ENUM ('NotSubmitted', 'Pending', 'Rejected', 'Approved');

CREATE TYPE content_license AS ENUM ('CCBY', 'CCBYSA', 'CCBYNC', 'CCBYNCSA', 'CCBYND', 'CCBYNCND', 'CC0');
