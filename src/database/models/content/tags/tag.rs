use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::database::models::content::tags::tag_kind::TagKind;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "ssr", derive(sqlx::FromRow))]
pub struct Tag {
    pub id: String,
    pub name: String,
    pub desc: String,
    pub parent_id: Option<String>,
    pub kind: TagKind,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[cfg(feature = "ssr")]
impl Tag {
    // TODO: implement Tag functions
}
