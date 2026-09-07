use super::role::Role;
use crate::app::AppResult;
use crate::errors::AppError;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct Account {
    pub id: Uuid,
    pub email: String,
    pub password: String,
    pub roles: Vec<Role>,
    pub terms_agree: bool,
    pub email_confirmed: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Account {
    /// Create a new account in the database. Returns the account if successful.
    pub async fn new(email: String, password: String, db: &PgPool) -> AppResult<Self> {
        let clean_email = ammonia::clean(&email);
        let clean_password = ammonia::clean(&password);

        let hash_result = tokio::task::spawn_blocking(move || {
            let argon2 = Argon2::default();
            match argon2.hash_password(clean_password.as_bytes()) {
                Ok(hash) => Ok(hash.to_string()),
                Err(e) => Err(e),
            }
        })
        .await??;

        let new_account: Self = sqlx::query_as!(
            Self,
            r#"
                INSERT INTO accounts (email, password, terms_agree) VALUES ($1, $2, $3)
                    RETURNING
                        id,
                        email,
                        password,
                        roles as "roles: Vec<Role>",
                        terms_agree,
                        email_confirmed,
                        created_at,
                        updated_at;
            "#,
            clean_email,
            hash_result,
            true
        )
        .fetch_one(db)
        .await?;

        Ok(new_account)
    }

    /// Verifies that the provided credentials match an associated account, returning said account if successful.
    pub async fn verify(email: String, password: String, db: &PgPool) -> AppResult<Self> {
        let account = Self::find_by_email(email, db).await;
        if let Some(account) = account {
            let potential_password = ammonia::clean(&password);
            let known_good_password = account.password.clone();

            tokio::task::spawn_blocking(move || {
                let hash = PasswordHash::new(&known_good_password)?;
                match Argon2::default().verify_password(potential_password.as_bytes(), &hash) {
                    Ok(()) => Ok(account),
                    Err(_) => Err(AppError::Unauthorized),
                }
            })
            .await?
        } else {
            Err(AppError::Unauthorized)
        }
    }

    /// Fetches an account by its email address.
    pub async fn find_by_email(email: String, db: &PgPool) -> Option<Self> {
        sqlx::query_as!(
            Self,
            r#"
                SELECT
                    id,
                    email,
                    password,
                    roles as "roles: Vec<Role>",
                    terms_agree,
                    email_confirmed,
                    created_at,
                    updated_at
                FROM accounts WHERE email = $1;
            "#,
            ammonia::clean(&email)
        )
        .fetch_optional(db)
        .await
        .ok()?
    }

    /// Fetches an account by its ID.
    pub async fn find_by_id(id: String, db: &PgPool) -> Option<Self> {
        sqlx::query_as!(
            Self,
            r#"
                SELECT
                    id,
                    email,
                    password,
                    roles as "roles: Vec<Role>",
                    terms_agree,
                    email_confirmed,
                    created_at,
                    updated_at
                FROM accounts WHERE id = $1
            "#,
            Uuid::parse_str(&id).ok()?
        )
        .fetch_optional(db)
        .await
        .ok()?
    }

    /// Marks an account's email as confirmed.
    pub async fn confirm(&self, db: &PgPool) -> AppResult<()> {
        _ = sqlx::query!(
            r#"
                UPDATE accounts SET email_confirmed = $1 WHERE id = $2;
            "#,
            true,
            self.id,
        )
        .execute(db)
        .await?;

        Ok(())
    }

    /// Resets a user's password.
    pub async fn reset_password(&self, new_password: String, db: &PgPool) -> AppResult<()> {
        let clean_password = ammonia::clean(&new_password);

        let hash_result = tokio::task::spawn_blocking(move || {
            let argon2 = Argon2::default();
            match argon2.hash_password(clean_password.as_bytes()) {
                Ok(hash) => Ok(hash.to_string()),
                Err(e) => Err(e),
            }
        })
        .await??;

        _ = sqlx::query!(
            r#"
                UPDATE accounts SET password = $1 WHERE id = $2;
            "#,
            hash_result,
            self.id
        )
        .execute(db)
        .await?;

        Ok(())
    }
}
