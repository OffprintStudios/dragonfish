use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
#[cfg(feature = "ssr")]
use sqlx::{FromRow, PgPool};

#[cfg(feature = "ssr")]
use crate::app::AppResult;
#[cfg(feature = "ssr")]
use crate::database::models::accounts::Session;
use crate::database::models::content::tags::{ContentLicense, ContentVisibility, Tag};

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
    pub tags: Vec<Tag>,
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

            sqlx::query_as(
                r#"
                    INSERT INTO blogs (author_id, title, body) VALUES ($1, $2, $3) RETURNING *;
                "#,
            )
            .bind(profile.id)
            .bind(clean_title)
            .bind(clean_body)
            .fetch_one(db)
            .await
            .map_err(|_| crate::errors::AppError::ServerError)
        } else {
            Err(crate::errors::AppError::ServerError)
        }
    }

    pub async fn to_object(&self, db: &PgPool) -> AppResult<BlogObject> {
        let (author_id, author_name, author_avatar) =
            sqlx::query_as::<_, (String, String, String)>(
                r#"
                    SELECT id, username, avatar FROM profiles WHERE id = $1;
                "#,
            )
            .bind(self.author_id.clone())
            .fetch_one(db)
            .await
            .map_err(|_| crate::errors::AppError::ServerError)?;

        let tags = sqlx::query_as::<_, Tag>(
            r#"
                SELECT *
                FROM tags t
                INNER JOIN blog_tags bt ON t.id = bt.tag_id
                WHERE bt.blog_id = $1 AND t.kind = 'Blog';
            "#,
        )
        .bind(self.id.clone())
        .fetch_all(db)
        .await
        .map_err(|_| crate::errors::AppError::ServerError)?;

        Ok(BlogObject {
            id: self.id.clone(),
            author_id,
            author_name,
            author_avatar,
            title: self.title.clone(),
            body: self.body.clone(),
            word_count: self.word_count,
            view_count: self.view_count,
            cheer_count: self.cheer_count,
            jeer_count: self.jeer_count,
            nsfw: self.nsfw,
            tags,
            license: self.license,
            visibility: self.visibility,
            edited_on: self.edited_on,
            published_on: self.published_on,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }

    pub async fn fetch_one(id: String, db: &PgPool) -> AppResult<Blog> {
        sqlx::query_as(
            r#"
                SELECT * FROM blogs WHERE id = $1;
            "#
        )
        todo!()
    }
}
