use crate::errors::AppError;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Follower {
    pub id: Uuid,
    pub profile_id: String,
    pub following: String,
    pub created_at: DateTime<Utc>,
}

impl Follower {
    pub async fn follow(
        profile_id: String,
        following: String,
        db: &PgPool,
    ) -> Result<Self, AppError> {
        let result: Self = sqlx::query_as!(
            Self,
            r#"
                INSERT INTO followers (profile_id, following) VALUES ($1, $2) RETURNING *;
            "#,
            ammonia::clean(&profile_id),
            ammonia::clean(&following),
        )
        .fetch_one(db)
        .await?;

        Ok(result)
    }

    pub async fn unfollow(
        profile_id: String,
        following: String,
        db: &PgPool,
    ) -> Result<(), AppError> {
        sqlx::query!(
            r#"
                DELETE FROM followers WHERE profile_id = $1 AND following = $2;
            "#,
            ammonia::clean(&profile_id),
            ammonia::clean(&following),
        )
        .fetch_one(db)
        .await?;

        Ok(())
    }

    pub async fn count_followers(profile_id: String, db: &PgPool) -> Option<i64> {
        sqlx::query_scalar!(
            r#"
                SELECT count(f.id) FROM followers f WHERE following = $1;
            "#,
            ammonia::clean(&profile_id),
        )
        .fetch_one(db)
        .await
        .ok()?
    }

    pub async fn count_following(profile_id: String, db: &PgPool) -> Option<i64> {
        sqlx::query_scalar!(
            r#"
                SELECT count(f.id) FROM followers f WHERE profile_id = $1;
            "#,
            ammonia::clean(&profile_id)
        )
        .fetch_one(db)
        .await
        .ok()?
    }
}
