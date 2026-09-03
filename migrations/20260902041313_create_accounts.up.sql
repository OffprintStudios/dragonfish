-- Add up migration script here
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    roles TEXT[] NOT NULL DEFAULT '{"User"}',
    terms_agree BOOLEAN NOT NULL DEFAULT FALSE,
    email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    ip_addr TEXT DEFAULT NULL,
    browser TEXT DEFAULT NULL,
    device TEXT DEFAULT NULL,
    os TEXT DEFAULT NULL,
    expires_on TIMESTAMPTZ NOT NULL DEFAULT (NOW() + interval '30' day),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp (
    id CHAR(21) PRIMARY KEY DEFAULT nanoid(),
    account_id UUID NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    expires_on TIMESTAMPTZ NOT NULL DEFAULT (current_timestamp + interval '1' hour),
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS profiles (
    id CHAR(21) PRIMARY KEY DEFAULT nanoid(),
    account_id UUID NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar TEXT NOT NULL DEFAULT 'https://images.offprint.net/avatars/avatar.png',
    banner_art TEXT DEFAULT NULL,
    bio TEXT NOT NULL DEFAULT 'Just another friendly face in the crowd',
    tagline TEXT DEFAULT NULL,
    links TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id CHAR(21) NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    "following" CHAR(21) NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    UNIQUE (profile_id, "following")
);

CREATE TABLE IF NOT EXISTS conversations (
    id CHAR(21) PRIMARY KEY DEFAULT nanoid(),
    "name" TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id CHAR(21) NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
    profile_id CHAR(21) NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (conversation_id, profile_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id CHAR(21) NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
    profile_id CHAR(21) NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

SELECT manage_updated_at('accounts');
SELECT manage_updated_at('profiles');
SELECT manage_updated_at('conversations');
SELECT manage_updated_at('messages');
