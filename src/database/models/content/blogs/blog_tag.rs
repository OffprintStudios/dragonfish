use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, FromRow)]
pub struct BlogTag {
    pub id: Uuid,
    pub blog_id: String,
    pub tag_id: String,
    pub created_at: DateTime<Utc>,
}
