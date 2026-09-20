use crate::errors::AppError;
use crate::ui::forms::{TextField, TextFieldType};
use crate::ui::misc::{Button, ButtonType, MetaTags};
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos::server_fn::codec::JsonEncoding;
use leptos::server_fn::error::ServerFnErrorErr;
use leptos_icons::*;
use leptos_router::components::A;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Clone, Serialize, Deserialize, Error, PartialEq, Eq)]
pub enum LogInError {
    #[error("You can't log in until your email's been confirmed, so we sent you a new confirmation code. Check your inbox and click the link to continue.")]
    EmailNotConfirmed,
    #[error("Doesn't look like you're on the list. Are you sure your info's all good?")]
    CredentialsInvalid,
    #[error("Uh-oh! Seems like something messed up on our end. Check back in a little bit.")]
    ServerError,
    #[error("Something went wrong with the server function.")]
    ServerFnError(ServerFnErrorErr),
}

impl FromServerFnError for LogInError {
    type Encoder = JsonEncoding;

    fn from_server_fn_error(value: ServerFnErrorErr) -> Self {
        Self::ServerFnError(value)
    }
}

impl From<AppError> for LogInError {
    fn from(_: AppError) -> Self {
        Self::ServerError
    }
}

#[server(LogIn, prefix = "/api/auth", endpoint = "log-in")]
pub async fn log_in(
    email: String,
    password: String,
    remember_me: Option<String>,
) -> Result<(), LogInError> {
    use crate::database::models::accounts::Session;

    Session::log_in(email, password, remember_me.is_some_and(|v| v == "on"))
        .await
        .map(|_| leptos_axum::redirect("/switch-profile"))
        .map_err(|e| match e {
            AppError::BadRequest => LogInError::CredentialsInvalid,
            AppError::Forbidden => LogInError::EmailNotConfirmed,
            _ => LogInError::ServerError,
        })
}

#[component]
pub fn LogInPage() -> impl IntoView {
    let submit = ServerAction::<LogIn>::new();
    let value = submit.value();
    let has_error = move || value.with(|val| matches!(val, Some(Err(_))));
    let error = move || {
        value.with(|val| {
            let some = val.to_owned();
            match some {
                Some(v) => match v {
                    Ok(()) => LogInError::ServerError.to_string(),
                    Err(e) => e.to_string(),
                },
                None => LogInError::ServerError.to_string(),
            }
        })
    };

    view! {
        <MetaTags
            url="https://offprint.cafe/log-in"
            title="Log In — Offprint"
            description="For The Stories Left Untold"
            image_url="/images/beatriz.png"
        />

        <div
            class="flex flex-col items-center justify-center md:justify-normal bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg border border-zinc-300/25 dark:border-zinc-600/25 md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit relative default-shadow"
        >
            <div class="flex flex-col items-center justify-center pb-4">
                <h1 class="text-3xl">"Welcome back!"</h1>
                <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold font-header">
                    "We're so glad you're here."
                </span>
            </div>
            <Show when=has_error>
                <div class="text-sm flex flex-col bg-red-600/25 border border-red-600/75 rounded-xl p-4 mb-4">
                    <div class="flex items-center mb-1">
                        <span class="mr-1"><Icon icon=TablerIcon::TbInfoCircleOutline width="20px" height="20px" /></span>
                        <span class="font-bold">"Head's Up!"</span>
                    </div>
                    <span>{error()}</span>
                </div>
            </Show>
            <ActionForm attr:class="flex flex-col w-full" action=submit>
                <TextField
                    name="email"
                    label="Email Address"
                    kind=TextFieldType::Email
                    placeholder="somebody@example.net"
                    autocomplete="email"
                    required=true
                />
                <div class="my-1.5"></div>
                <TextField
                    name="password"
                    label="Password"
                    kind=TextFieldType::Password
                    placeholder="••••••••••"
                    autocomplete="current-password"
                    required=true
                />
                <A attr:class="text-zinc-500 dark:text-zinc-400 text-sm pt-2 hover:underline" href="/forgot-password">"Forgot your password?"</A>
                <label class="flex mt-4">
                    <input
                        id="remember-me"
                        name="remember_me"
                        type="checkbox"
                        class="rounded bg-zinc-500 w-[18px] h-[18px] relative top-[0.075rem] border-0 mr-2 transition checked:bg-blue-500/75"
                    />
                    <span class="text-sm align-top select-none">
                        "Remember me for 30 days"
                    </span>
                </label>
                <div class="my-3"></div>
                <Button
                    id="log-in-button"
                    title="Log In"
                    type_of=ButtonType::Submit
                    primary=true
                    full_width=true
                >
                    <span class="button-icon"><Icon icon=TablerIcon::TbLogin2Outline /></span>
                    <span class="button-text">"Log In"</span>
                </Button>
                <A attr:class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href="/sign-up">
                    "Looking to join? Sign up today!"
                </A>
            </ActionForm>
        </div>
    }
}
