use crate::errors::AppError;
use crate::ui::forms::{TextField, TextFieldType};
use crate::ui::misc::{Button, ButtonType, MetaTags};
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos::server_fn::codec::JsonEncoding;
use leptos_icons::*;
use leptos_router::components::A;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Clone, Serialize, Deserialize, Error)]
pub enum SignUpError {
    #[error("That's not a valid email address!")]
    InvalidEmail,
    #[error("Your passwords don't match! Check to make sure you've entered them correctly.")]
    PasswordsDontMatch,
    #[error("You must be 13 years of age or older to join Offprint.")]
    AgeCheckFail,
    #[error("You must agree to the Terms of Service, Privacy Policy, and Offprint Constitution before joining Offprint.")]
    TermsAgreeFail,
    #[error("An account with this email address already exists!")]
    Conflict,
    #[error("Uh-oh. Seems like something messed up on our end. Check back in a little bit.")]
    ServerError,
    #[error("Something went wrong with the server function.")]
    ServerFnError(ServerFnErrorErr),
}

impl FromServerFnError for SignUpError {
    type Encoder = JsonEncoding;

    fn from_server_fn_error(value: ServerFnErrorErr) -> Self {
        Self::ServerFnError(value)
    }
}

impl From<AppError> for SignUpError {
    fn from(_: AppError) -> Self {
        Self::ServerError
    }
}

#[server(SignUp, prefix = "/api/auth", endpoint = "sign-up")]
pub async fn sign_up(
    email: String,
    password: String,
    repeat_password: String,
    age_check: Option<String>,
    terms_agree: Option<String>,
) -> Result<(), SignUpError> {
    use crate::database::models::accounts::{Account, Otp, OtpKind};
    use crate::queues::email::{Email, EmailKind};
    use crate::state::AppState;
    use apalis::prelude::TaskSink;
    use apalis_redis::RedisStorage;
    use axum::Extension;
    use email_address::EmailAddress;

    if !EmailAddress::is_valid(&email) {
        return Err(SignUpError::InvalidEmail);
    }

    if password != repeat_password {
        return Err(SignUpError::PasswordsDontMatch);
    }

    if age_check.is_some_and(|val| val != "on") {
        return Err(SignUpError::AgeCheckFail);
    }

    if terms_agree.is_some_and(|val| val != "on") {
        return Err(SignUpError::TermsAgreeFail);
    }

    let state = expect_context::<AppState>();
    let Extension(mut queue) = leptos_axum::extract::<Extension<RedisStorage<Email>>>()
        .await
        .map_err(SignUpError::ServerFnError)?;

    if Account::find_by_email(email.clone(), &state.db)
        .await
        .is_some()
    {
        return Err(SignUpError::Conflict);
    }

    let account = Account::new(email, password, &state.db).await?;
    let confirmation_code = Otp::new(account.id, OtpKind::EmailConfirmation, &state.db).await?;

    let new_email = Email {
        kind: EmailKind::ConfirmEmail,
        from: "Beatriz <no-reply@offprint.cafe>".into(),
        to: account.email.clone(),
        subject: "Welcome to Offprint!".into(),
        token: Some(confirmation_code.id),
    };

    let job = queue.push(new_email).await;
    match job {
        Ok(_) => {
            leptos_axum::redirect("/check-email");
            Ok(())
        }
        Err(_) => Err(SignUpError::ServerError),
    }
}

#[component]
pub fn SignUpPage() -> impl IntoView {
    let submit = ServerAction::<SignUp>::new();
    let value = submit.value();
    let has_error = move || value.with(|val| matches!(val, Some(Err(_))));
    let error = move || {
        value.with(|val| {
            let some = val.to_owned();
            match some {
                Some(v) => match v {
                    Ok(()) => SignUpError::ServerError.to_string(),
                    Err(e) => e.to_string(),
                },
                None => SignUpError::ServerError.to_string(),
            }
        })
    };

    view! {
        <MetaTags
            url="https://offprint.cafe/sign-up"
            title="Sign Up — Offprint"
            description="For The Stories Left Untold"
            image_url="/images/beatriz.png"
        />

        <div class="flex flex-col items-center justify-center bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg border border-zinc-300/25 dark:border-zinc-600/25 md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit overflow-y-scroll scrollbar-none" style="box-shadow: var(--dropshadow);">
            <div class="flex flex-col items-center justify-center pb-4">
                <h1 class="text-3xl">"Welcome to Offprint!"</h1>
                <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center font-header">
                    "Let's get started, shall we?"
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
                <div class="my-1"></div>
                <TextField
                    name="password"
                    label="Password"
                    kind=TextFieldType::Password
                    placeholder="••••••••••"
                    autocomplete="new-password"
                    required=true
                />
                <div class="my-1"></div>
                <TextField
                    name="repeat_password"
                    label="Repeat Password"
                    kind=TextFieldType::Password
                    placeholder="••••••••••"
                    autocomplete="new-password"
                    required=true
                />
                <label class="flex mt-4 mb-2">
                    <input
                        id="age-check"
                        name="age_check"
                        type="checkbox"
                        required
                        class="rounded bg-zinc-500 w-[18px] h-[18px] relative top-[0.075rem] border-0 mr-2 transition checked:bg-blue-500/75"
                    />
                    <span class="text-sm align-top select-none">"I am 13 years of age or older"</span>
                </label>
                <label class="flex mt-2 mb-4">
                    <input
                        id="terms-agree"
                        name="terms_agree"
                        type="checkbox"
                        required
                        class="rounded bg-zinc-500 w-[18px] h-[18px] relative top-[0.075rem] border-0 mr-2 transition checked:bg-blue-500/75"
                    />
                    <span class="text-sm align-top select-none">
                        "I agree to the "<A attr:class="text-accent hover:underline" href="/settings/about/terms-of-service">"Terms of Service"</A>", "<A attr:class="text-accent hover:underline" href="/settings/about/privacy-policy">"Privacy Policy"</A>", and "<A attr:class="text-accent hover:underline" href="/settings/about/constitution">"Offprint Constitution"</A>
                    </span>
                </label>
                <Button
                    id="sign-up-button"
                    title="Sign Up"
                    type_of=ButtonType::Submit
                    primary=true
                    full_width=true
                >
                    <span class="button-icon"><Icon icon=TablerIcon::TbUserPlusOutline /></span>
                    <span class="button-text">"Sign Up"</span>
                </Button>
                <A attr:class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href="/log-in">
                    "Already have an account?"
                </A>
            </ActionForm>
        </div>
    }
}
