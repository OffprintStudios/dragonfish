use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
#[cfg(feature = "ssr")]
use sqlx::{FromRow, PgPool};

#[cfg(feature = "ssr")]
use crate::app::AppResult;
#[cfg(feature = "ssr")]
use crate::database::models::accounts::Session;
use crate::database::models::content::tags::{ContentLicense, ContentVisibility};

#[cfg(feature = "ssr")]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, FromRow)]
pub struct Blog {
    pub id: String,
    pub author_id: String,
    pub title: String,
    pub body: String,
    pub word_count: i64,
    pub view_count: i64,
    pub cheer_count: i64,
    pub jeer_count: i64,
    pub nsfw: bool,
    pub license: ContentLicense,
    pub visibility: ContentVisibility,
    pub allow_comments: bool,
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
    pub cheer_count: i64,
    pub jeer_count: i64,
    pub nsfw: bool,
    pub license: ContentLicense,
    pub visibility: ContentVisibility,
    pub edited_on: Option<DateTime<Utc>>,
    pub published_on: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[cfg(feature = "ssr")]
impl Blog {
    pub async fn new(
        author_id: String,
        title: String,
        body: String,
        db: &PgPool,
    ) -> AppResult<Self> {
        if let Some(profile) = Session::check_profile(author_id, db).await {
            let clean_title = ammonia::clean(&title);
            let clean_body = ammonia::clean(&body);

            let blog = sqlx::query_as!(
                Self,
                r#"
                    INSERT INTO blogs (author_id, title, body) VALUES ($1, $2, $3)
                    RETURNING
                        id,
                        author_id,
                        title,
                        body,
                        word_count,
                        view_count,
                        cheer_count,
                        jeer_count,
                        nsfw,
                        license as "license: ContentLicense",
                        visibility as "visibility: ContentVisibility",
                        allow_comments,
                        edited_on,
                        published_on,
                        created_at,
                        updated_at,
                        deleted_at;
                "#,
                profile.id,
                clean_title,
                clean_body
            )
            .fetch_one(db)
            .await?;
        }

        todo!()
    }

    pub async fn to_object(&self, db: &PgPool) -> AppResult<BlogObject> {
        sqlx::query_as!(
            BlogObject,
            r#"
                SELECT
                    id,
                    author_id,
                    author_name,
                    author_avatar,
                    title,
                    body,
                    word_count,
                    view_count,
                    cheer_count,
                    jeer_count,
                    nsfw,
                    license as "license: ContentLicense",
                    visibility as "visibility: ContentVisibility",
                    edited_on,
                    published_on,
                    created_at,
                    updated_at
                FROM blog_objects WHERE id = $1;
            "#,
            self.id
        )
        .fetch_one(db)
        .await
        .map_err(|_| AppError::ServerError)
    }
}
