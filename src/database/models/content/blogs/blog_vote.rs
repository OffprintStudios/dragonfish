use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub enum BlogVoteStatus {
    Cheer = 1,
    None = 0,
    Jeer = -1,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, FromRow)]
pub struct BlogVote {
    pub id: Uuid,
    pub profile_id: String,
    pub blog_id: String,
    pub vote: BlogVoteStatus,
    pub created_at: DateTime<Utc>,
}
