use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::database::models::content::tags::{ContentLicense, ContentRating, ContentVisibility};

#[cfg(feature = "ssr")]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, sqlx::FromRow)]
pub struct Blog {
    pub id: String,
    pub author_id: String,
    pub title: String,
    pub body: String,
    pub word_count: i64,
    pub view_count: i64,
    pub rating: ContentRating,
    pub license: ContentLicense,
    pub visibility: ContentVisibility,
    pub edited_on: Option<DateTime<Utc>>,
    pub published_on: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct BlogObject {
    pub id: String,
    pub author_id: String,
    pub author_name: String,
    pub author_avatar: String,
    pub title: String,
    pub body: String,
    pub word_count: i64,
    pub view_count: i64,
}
