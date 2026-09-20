use crate::app::AppResult;
use crate::errors::AppError;
use leptos::prelude::*;

#[server(prefix = "/api/auth", endpoint = "validate")]
pub async fn validate() -> AppResult<()> {
    use crate::database::models::accounts::{Role, Session};
    use crate::state::AppState;

    let state = expect_context::<AppState>();

    match Session::authorize(vec![Role::User], &state.db).await {
        Some(_) => Ok(()),
        None => Err(AppError::Unauthorized),
    }
}

#[server(prefix = "/api/auth", endpoint = "validate-qc")]
pub async fn validate_qc() -> AppResult<()> {
    use crate::database::models::accounts::{Role, Session};
    use crate::state::AppState;

    let state = expect_context::<AppState>();

    match Session::authorize(
        vec![Role::Admin, Role::Moderator, Role::WorkApprover],
        &state.db,
    )
    .await
    {
        Some(_) => Ok(()),
        None => Err(AppError::Forbidden),
    }
}

#[server(prefix = "/api/auth", endpoint = "validate-moderator")]
pub async fn validate_moderator() -> AppResult<()> {
    use crate::database::models::accounts::{Role, Session};
    use crate::state::AppState;

    let state = expect_context::<AppState>();

    match Session::authorize(vec![Role::Admin, Role::Moderator], &state.db).await {
        Some(_) => Ok(()),
        None => Err(AppError::Forbidden),
    }
}

#[server(prefix = "/api/auth", endpoint = "validate-admin")]
pub async fn validate_admin() -> AppResult<()> {
    use crate::database::models::accounts::{Role, Session};
    use crate::state::AppState;

    let state = expect_context::<AppState>();

    match Session::authorize(vec![Role::Admin], &state.db).await {
        Some(_) => Ok(()),
        None => Err(AppError::Forbidden),
    }
}
