use crate::database::models::accounts::Role;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[cfg(feature = "ssr")]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[cfg_attr(feature = "ssr", derive(sqlx::FromRow))]
pub struct Profile {
    pub id: String,
    pub account_id: uuid::Uuid,
    pub username: String,
    pub avatar: String,
    pub banner_art: Option<String>,
    pub bio: String,
    pub tagline: Option<String>,
    pub links: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ProfileObject {
    pub id: String,
    pub username: String,
    pub avatar: String,
    pub banner_art: Option<String>,
    pub bio: String,
    pub tagline: Option<String>,
    pub links: Vec<String>,
    pub followers: i64,
    pub following: i64,
    pub works: i64,
    pub blogs: i64,
    pub roles: Vec<Role>,
    pub created_at: DateTime<Utc>,
}

#[cfg(feature = "ssr")]
impl Profile {
    pub async fn new(
        account_id: uuid::Uuid,
        username: String,
        db: &sqlx::PgPool,
    ) -> crate::app::AppResult<Self> {
        let clean_username = ammonia::clean(&username);

        let result: Self = sqlx::query_as!(
            Self,
            r#"
                INSERT INTO profiles (account_id, username) VALUES ($1, $2) RETURNING *;
            "#,
            account_id,
            clean_username,
        )
        .fetch_one(db)
        .await?;

        Ok(result)
    }

    pub async fn fetch_one(id: String, db: &sqlx::PgPool) -> crate::app::AppResult<Self> {
        let result: Self = sqlx::query_as!(
            Self,
            r#"
                SELECT * FROM profiles WHERE id = $1 AND deleted_at IS NULL LIMIT 1;
            "#,
            ammonia::clean(&id),
        )
        .fetch_one(db)
        .await?;

        Ok(result)
    }

    pub async fn fetch_by_username(username: String, db: &sqlx::PgPool) -> Option<Self> {
        let result: Self = sqlx::query_as!(
            Self,
            r#"
                SELECT * FROM profiles WHERE username = $1 AND deleted_at IS NULL LIMIT 1;
            "#,
            ammonia::clean(&username)
        )
        .fetch_one(db)
        .await
        .ok()?;

        Some(result)
    }

    pub async fn fetch_owned(
        account_id: uuid::Uuid,
        db: &sqlx::PgPool,
    ) -> crate::app::AppResult<Vec<Self>> {
        let result: Vec<Self> = sqlx::query_as!(
            Self,
            r#"
                SELECT * FROM profiles WHERE account_id = $1 AND deleted_at IS NULL;
            "#,
            account_id,
        )
        .fetch_all(db)
        .await?;

        Ok(result)
    }

    pub async fn check_owned(id: String, account_id: uuid::Uuid, db: &sqlx::PgPool) -> bool {
        sqlx::query!(
            r#"
                SELECT id FROM profiles WHERE id = $1 AND account_id = $2 AND deleted_at IS NULL LIMIT 1;
            "#,
            ammonia::clean(&id),
            account_id,
        ).fetch_one(db).await.ok().is_some()
    }

    pub async fn to_object(&self, db: &sqlx::PgPool) -> ProfileObject {
        use crate::database::models::accounts::Account;
        use crate::database::models::profiles::Follower;

        let account = Account::find_by_id(self.account_id.to_string(), db)
            .await
            .unwrap();
        let count_followers = Follower::count_followers(self.id.clone(), db).await;
        let count_following = Follower::count_following(self.id.clone(), db).await;

        ProfileObject {
            id: self.id.clone(),
            username: self.username.clone(),
            avatar: self.avatar.clone(),
            banner_art: self.banner_art.clone(),
            bio: self.bio.clone(),
            tagline: self.tagline.clone(),
            links: self.links.clone(),
            followers: count_followers.unwrap_or(0),
            following: count_following.unwrap_or(0),
            works: 0,
            blogs: 0,
            roles: account.roles,
            created_at: self.created_at,
        }
    }
}
