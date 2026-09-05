use http::StatusCode;
use leptos::prelude::*;
use leptos::server_fn::codec::JsonEncoding;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Clone, Serialize, Deserialize, Error, PartialEq, Eq)]
pub enum AppError {
    #[error("The page you're looking for ain't 'round here, friend")]
    NotFound,
    #[error("You shouldn't toy with fate like that")]
    Unauthorized,
    #[error("The ancient ways shall remain unknown to you, traveler")]
    Forbidden,
    #[error("Looks like you're trying to fit a round peg in a square hole")]
    MethodNotAllowed,
    #[error("Seems like we're getting mixed messages here")]
    BadRequest,
    #[error("Look, this page isn't a bug—it's a feature")]
    ServerError,
    #[error("Cleaning the espresso machines, be back soon")]
    ServiceUnavailable,
    #[error("ServerFnError")]
    ServerFnError(ServerFnErrorErr),
}

impl AppError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            AppError::NotFound => StatusCode::NOT_FOUND,
            AppError::Unauthorized => StatusCode::UNAUTHORIZED,
            AppError::Forbidden => StatusCode::FORBIDDEN,
            AppError::MethodNotAllowed => StatusCode::METHOD_NOT_ALLOWED,
            AppError::BadRequest => StatusCode::BAD_REQUEST,
            AppError::ServerError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::ServiceUnavailable => StatusCode::SERVICE_UNAVAILABLE,
            AppError::ServerFnError(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

impl FromServerFnError for AppError {
    type Encoder = JsonEncoding;

    fn from_server_fn_error(value: ServerFnErrorErr) -> Self {
        Self::ServerFnError(value)
    }
}

cfg_if::cfg_if! {
    if #[cfg(feature = "ssr")] {
        use sqlx::Error as SqlxError;
        use argon2::password_hash::Error as PasswordHashError;
        use tokio::task::JoinError;

        impl From<SqlxError> for AppError {
            fn from(e: SqlxError) -> Self {
                match e {
                    SqlxError::RowNotFound => Self::NotFound,
                    _ => Self::ServerError,
                }
            }
        }

        impl From<PasswordHashError> for AppError {
            fn from(_: PasswordHashError) -> Self {
                Self::ServerError
            }
        }

        impl From<JoinError> for AppError {
            fn from(_: JoinError) -> Self {
                Self::ServerError
            }
        }
    }
}

#[component]
pub fn ErrorTemplate(#[prop(into)] errors: Signal<Errors>) -> impl IntoView {
    let errors: Vec<AppError> = errors
        .get_untracked()
        .into_iter()
        .filter_map(|(_, v)| v.downcast_ref::<AppError>().cloned())
        .collect();

    #[cfg(feature = "ssr")]
    {
        use leptos_axum::ResponseOptions;

        let response = use_context::<ResponseOptions>();
        if let Some(response) = response {
            response.set_status(errors[0].status_code());
        }
    }

    view! {
        <div
            class="flex flex-col items-center justify-center w-full h-svh bg-cover bg-center relative z-0"
            style="background-image: url('/images/backpacker.jpg')"
        >
            <div class="bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg border border-zinc-300/25 dark:border-zinc-600/25 md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit" style="box-shadow: var(--dropshadow);">
                <For
                    each=move || { errors.clone().into_iter().enumerate() }
                    key=|(index, _error)| *index
                    children=move |error| {
                        let error_string = error.1.to_string();
                        let error_code = error.1.status_code();

                        view! {
                            <div class="flex flex-col items-center justify-center pb-4">
                                <h1 class="text-3xl">{error_code.to_string()}</h1>
                            </div>
                            <p class="text-center">{error_string}</p>
                        }
                    }
                />
            </div>
        </div>
    }
}
