use super::account::Account;
use super::otp::{Otp, OtpKind};
use super::role::Role;
use crate::app::AppResult;
use crate::constants::{
    MAX_SESSION_DURATION, MIN_SESSION_DURATION, SECRET_KEY, SESSION_TOKEN_NAME,
};
use crate::errors::AppError;
use crate::queues::email::{Email, EmailKind};
use crate::state::AppState;
use crate::util::functions::intersection;
use apalis::prelude::TaskSink;
use apalis_redis::RedisStorage;
use axum::Extension;
use chrono::{DateTime, Duration, Utc};
use leptos::prelude::*;
use leptos_axum::extract;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use std::ops::Add;
use std::str::FromStr;
use tower_cookies::{Cookie, Cookies};
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
    /// Logs a user in and starts a new session. If their email is not confirmed,
    /// this function will send out a confirmation email and then return an error.
    pub async fn log_in(email: String, password: String, remember_me: bool) -> AppResult<()> {
        let key = SECRET_KEY.get().unwrap();
        let state = expect_context::<AppState>();
        let cookies = extract::<Cookies>()
            .await
            .map_err(|_| AppError::ServerError)?
            .private(key);

        let account = match Account::verify(email, password, &state.db).await {
            Ok(account) => account,
            Err(_) => return Err(AppError::BadRequest),
        };

        if !account.email_confirmed {
            let Extension(mut queue) = extract::<Extension<RedisStorage<Email>>>()
                .await
                .map_err(|_| AppError::ServerError)?;
            let code = Otp::new(account.id, OtpKind::EmailConfirmation, &state.db).await?;

            let new_email = Email {
                kind: EmailKind::ConfirmEmail,
                from: "Beatriz <no-reply@offprint.cafe>".into(),
                to: account.email.clone(),
                subject: "Welcome to Offprint!".into(),
                token: Some(code.id),
            };

            let job = queue.push(new_email).await;
            match job {
                Ok(_) => return Err(AppError::Forbidden),
                Err(_) => return Err(AppError::ServerError),
            }
        }

        let token_offset = match remember_me {
            true => MAX_SESSION_DURATION,
            false => MIN_SESSION_DURATION,
        };

        let session_id = match Session::start(
            account.id,
            Utc::now() + Duration::seconds(token_offset),
            &state.db,
        )
        .await
        {
            Ok(id) => id,
            Err(_) => return Err(AppError::ServerError),
        };

        let session_token = Cookie::build((SESSION_TOKEN_NAME, session_id))
            .path("/")
            .http_only(true)
            .secure(true)
            .expires(
                tower_cookies::cookie::time::OffsetDateTime::now_utc()
                    .add(tower_cookies::cookie::time::Duration::seconds(token_offset)),
            )
            .max_age(tower_cookies::cookie::time::Duration::seconds(token_offset))
            .same_site(tower_cookies::cookie::SameSite::Strict)
            .build();

        cookies.add(session_token);

        Ok(())
    }

    /// Logs a user out. Erases their session in the database and clears all authentication cookies.
    pub async fn log_out() -> AppResult<()> {
        let key = SECRET_KEY.get().unwrap();
        let state = expect_context::<AppState>();
        let cookies = extract::<Cookies>()
            .await
            .map_err(|_| AppError::ServerError)?
            .private(key);

        // This converts the string into a valid UUID to make sure whatever ID value inside the cookie is actually a valid ID.
        let session = match cookies.get(SESSION_TOKEN_NAME) {
            Some(session) => session,
            None => return Err(AppError::BadRequest),
        };

        _ = sqlx::query!(
            r#"DELETE FROM sessions WHERE id = $1"#,
            Uuid::from_str(session.value()).map_err(|_| AppError::ServerError)?
        )
        .execute(&state.db)
        .await?;

        cookies.remove(session);

        Ok(())
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

    /// Verifies an active session via database lookup and returns the corresponding account.
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

    /// Authorizes an account based on a list of required roles.
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
