use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, FromRow)]
pub struct Badge {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon_url: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, FromRow)]
pub struct ProfileBadge {
    pub id: Uuid,
    pub badge_id: String,
    pub profile_id: String,
    pub awarded_at: DateTime<Utc>,
}
