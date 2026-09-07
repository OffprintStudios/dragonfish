use super::account::Account;
use crate::app::AppResult;
use crate::errors::AppError;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool, Type};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub enum OtpKind {
    PasswordReset,
    EmailConfirmation,
}

impl From<String> for OtpKind {
    fn from(value: String) -> Self {
        match value.as_str() {
            "EmailConfirmation" => OtpKind::EmailConfirmation,
            "PasswordReset" => OtpKind::PasswordReset,
            _ => OtpKind::EmailConfirmation,
        }
    }
}

impl std::fmt::Display for OtpKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OtpKind::EmailConfirmation => write!(f, "EmailConfirmation"),
            OtpKind::PasswordReset => write!(f, "PasswordReset"),
        }
    }
}

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct Otp {
    pub id: String,
    pub account_id: Uuid,
    pub kind: OtpKind,
    pub expires_on: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

impl Otp {
    /// Creates a new validation token
    pub async fn new(account_id: Uuid, kind: OtpKind, db: &PgPool) -> AppResult<Self> {
        let reset: Self = sqlx::query_as!(
            Self,
            r#"INSERT INTO otp (account_id, kind) VALUES ($1, $2) RETURNING *;"#,
            account_id,
            kind.to_string(),
        )
        .fetch_one(db)
        .await?;

        Ok(reset)
    }

    /// Checks to see if a password reset code is valid, returning the related account if so
    pub async fn validate(token: String, kind: OtpKind, db: &PgPool) -> AppResult<Account> {
        let code: Option<Self> = sqlx::query_as!(
            Self,
            r#"SELECT * FROM otp WHERE kind = $1 AND id = $2 AND expires_on > $3;"#,
            kind.to_string(),
            token,
            Utc::now(),
        )
        .fetch_optional(db)
        .await?;

        if let Some(code) = code {
            _ = sqlx::query!(r#"DELETE FROM otp WHERE id = $1;"#, code.id)
                .execute(db)
                .await?;

            Account::find_by_id(code.account_id.to_string(), db)
                .await
                .ok_or(AppError::Unauthorized)
        } else {
            Err(AppError::Unauthorized)
        }
    }
}
