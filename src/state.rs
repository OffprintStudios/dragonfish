use axum::extract::{FromRef, FromRequestParts};
use http::request::Parts;
use leptos::prelude::LeptosOptions;
use sqlx::PgPool;

#[derive(Debug, Clone, FromRef)]
pub struct AppState {
    pub db: PgPool,
    pub leptos_options: LeptosOptions,
}

impl<S> FromRequestParts<S> for AppState
where
    Self: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = ();

    async fn from_request_parts(_: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        Ok(Self::from_ref(state))
    }
}
