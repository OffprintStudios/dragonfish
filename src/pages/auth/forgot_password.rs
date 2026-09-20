use crate::errors::AppError;
use crate::ui::forms::{TextField, TextFieldType};
use crate::ui::misc::{Button, ButtonType, MetaTags};
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;

#[server(SendResetCode, prefix = "/api/auth", endpoint = "send-reset-code")]
pub async fn send_reset_code(email: String) -> Result<(), AppError> {
    use crate::database::models::accounts::{Account, Otp, OtpKind};
    use crate::queues::email::{Email, EmailKind};
    use crate::state::AppState;
    use apalis::prelude::TaskSink;
    use apalis_redis::RedisStorage;
    use axum::Extension;

    let state = expect_context::<AppState>();
    if let Some(account) = Account::find_by_email(email, &state.db).await {
        let Extension(mut queue) = leptos_axum::extract::<Extension<RedisStorage<Email>>>()
            .await
            .map_err(AppError::ServerFnError)?;
        let reset_code = Otp::new(account.id, OtpKind::PasswordReset, &state.db).await?;

        let new_email = Email {
            kind: EmailKind::PasswordReset,
            from: "Beatriz <no-reply@offprint.cafe>".into(),
            to: account.email.clone(),
            subject: "Reset Your Offprint Password".into(),
            token: Some(reset_code.id),
        };

        match queue.push(new_email).await {
            Ok(_) => Ok(()),
            Err(_) => Ok(()),
        }
    } else {
        Ok(())
    }
}

#[server(ResetPassword, prefix = "/api/auth", endpoint = "reset-password")]
pub async fn reset_password(
    new_password: String,
    repeat_password: String,
    token: String,
) -> Result<(), AppError> {
    use crate::database::models::accounts::{Otp, OtpKind};
    use crate::state::AppState;

    let state = expect_context::<AppState>();

    if new_password != repeat_password {
        return Err(AppError::BadRequest);
    }

    if let Ok(valid_account) = Otp::validate(token, OtpKind::PasswordReset, &state.db).await {
        valid_account
            .reset_password(new_password, &state.db)
            .await
            .unwrap_or(());
        Ok(())
    } else {
        Ok(())
    }
}

#[component]
pub fn ForgotPasswordPage() -> impl IntoView {
    let query = leptos_router::hooks::use_query_map();
    let token = move || query.with(|q| q.get("token"));

    let send_code_submit = ServerAction::<SendResetCode>::new();
    let send_code_value = send_code_submit.value();
    let has_code_success = move || send_code_value.with(|val| matches!(val, Some(Ok(()))));

    let reset_password_submit = ServerAction::<ResetPassword>::new();
    let reset_password_value = reset_password_submit.value();
    let has_reset_success = move || reset_password_value.with(|val| matches!(val, Some(Ok(()))));

    view! {
        <MetaTags
            url="https://offprint.cafe/reset-password"
            title="Reset Password — Offprint"
            description="For The Stories Left Untold"
            image_url="/images/beatriz.png"
        />

        <div class="flex flex-col items-center justify-center bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit overflow-y-scroll scrollbar-none" style="box-shadow: var(--dropshadow);">
            <Show
                when=move || token().is_some()
                fallback=move || {
                    let navigate = leptos_router::hooks::use_navigate();
                    let go_back = move |_| {
                        navigate("/log-in", Default::default());
                    };

                    view! {
                        <ActionForm attr:class="flex flex-col w-full" action=send_code_submit>
                            <h1 class="text-3xl text-center">"Forgot Your Password?"</h1>
                            <Show when=has_code_success>
                                <div class="text-sm flex flex-col bg-green-600/25 border border-green-600/75 rounded-xl p-4 mb-4">
                                    <div class="flex items-center mb-1">
                                        <span class="mr-1"><Icon icon=TablerIcon::TbInfoCircleOutline width="20px" height="20px" /></span>
                                        <span class="font-bold">"Head's Up!"</span>
                                    </div>
                                    <span>"If you've got an account with us, we've sent instructions on how to reset your password."</span>
                                </div>
                            </Show>
                            <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold items-center text-center pt-2 pb-4 font-header">
                                "Let's get you back in the game"
                            </span>
                            <TextField
                                name="email"
                                label="Email Address"
                                kind=TextFieldType::Email
                                placeholder="somebody@example.net"
                                autocomplete="email"
                                required=true
                            />
                            <div class="my-2"></div>
                            <Button
                                id="send-email-button"
                                title="Send Reset Email"
                                type_of=ButtonType::Submit
                                primary=true
                                full_width=true
                            >
                                <span class="button-icon"><Icon icon=TablerIcon::TbMailFastOutline /></span>
                                <span class="button-text">"Send Reset Email"</span>
                            </Button>
                            <div class="my-1"></div>
                            <Button
                                id="cancel-button"
                                title="Cancel"
                                type_of=ButtonType::Default
                                full_width=true
                                on:click=go_back
                            >
                                <span class="button-icon"><Icon icon=TablerIcon::TbXOutline /></span>
                                <span class="button-text">"Cancel"</span>
                            </Button>
                        </ActionForm>
                    }
                }
            >
                <ActionForm attr:class="flex flex-col w-full" action=reset_password_submit>
                    <h1 class="text-3xl text-center">"Reset Your Password"</h1>
                    <Show when=has_reset_success>
                        <div class="text-sm flex flex-col bg-green-600/25 border border-green-600/75 rounded-xl p-4 mb-4">
                            <div class="flex items-center mb-1">
                                <span class="mr-1"><Icon icon=TablerIcon::TbInfoCircleOutline width="20px" height="20px" /></span>
                                <span class="font-bold">"Looking Good!"</span>
                            </div>
                            <span>"Your password's been successfully reset."</span>
                        </div>
                    </Show>
                    <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold items-center text-center py-2 font-header">
                        "Enter your new password"
                    </span>
                    <TextField
                        name="new_password"
                        label="Password"
                        kind=TextFieldType::Password
                        placeholder="••••••••••"
                        autocomplete="new-password"
                        required=true
                    />
                    <TextField
                        name="repeat_password"
                        label="Password"
                        kind=TextFieldType::Password
                        placeholder="••••••••••"
                        autocomplete="new-password"
                        required=true
                    />
                    <div class="hidden">
                        <input type="text" name="token" value={token()} required=true />
                    </div>
                    <div class="my-3"></div>
                    <Button
                        id="reset-password-button"
                        title="Reset Password"
                        type_of=ButtonType::Submit
                        primary=true
                        full_width=true
                    >
                        <span class="button-icon"><Icon icon=TablerIcon::TbKeyOutline /></span>
                        <span class="button-text">"Reset Password"</span>
                    </Button>
                </ActionForm>
            </Show>
        </div>
    }
}
