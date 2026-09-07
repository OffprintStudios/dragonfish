use super::account::Account;
use super::role::Role;
use crate::app::AppResult;
use crate::constants::{SECRET_KEY, SESSION_TOKEN_NAME};
use crate::errors::AppError;
use crate::util::functions::intersection;
use chrono::{DateTime, Utc};
use leptos_axum::extract;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use tower_cookies::Cookies;
use uuid::Uuid;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct Session {
    pub id: Uuid,
    pub account_id: Uuid,
    pub ip_addr: Option<String>,
    pub browser: Option<String>,
    pub device: Option<String>,
    pub os: Option<String>,
    pub expires_on: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

impl Session {
    pub async fn log_in(email: String, password: String) -> AppResult<Self> {
        todo!()
    }

    /// Starts a new session, adding a `Session` to the database and returning its ID.
    pub async fn start(
        account_id: Uuid,
        expiration: DateTime<Utc>,
        db: &PgPool,
    ) -> AppResult<String> {
        let record = sqlx::query!(
            r#"INSERT INTO sessions (account_id, expires_on) VALUES ($1, $2) RETURNING id;"#,
            account_id,
            expiration,
        )
        .fetch_one(db)
        .await?;

        Ok(record.id.to_string())
    }

    /// Verifies an active session via database lookup and returns the corresponding account ID.
    pub async fn verify_session(session_id: Uuid, db: &PgPool) -> AppResult<Account> {
        let account_id: String = match sqlx::query!(
            r#"SELECT account_id FROM sessions WHERE id = $1 AND expires_on > $2;"#,
            session_id,
            Utc::now(),
        )
        .fetch_one(db)
        .await
        {
            Ok(s) => s.account_id.to_string(),
            Err(_) => return Err(AppError::Unauthorized),
        };

        Account::find_by_id(account_id, db)
            .await
            .ok_or(AppError::Unauthorized)
    }

    /// Authorizes an account based on a session
    pub async fn authorize(required_roles: Vec<Role>, db: &PgPool) -> Option<Account> {
        let key = SECRET_KEY.get()?;
        let cookies = extract::<Cookies>().await.ok()?.private(key);

        let token = Uuid::parse_str(cookies.get(SESSION_TOKEN_NAME)?.value()).ok()?;

        let account = Self::verify_session(token, db).await.ok()?;

        match intersection(&required_roles, &account.roles).is_empty() {
            true => None,
            false => Some(account),
        }
    }
}
