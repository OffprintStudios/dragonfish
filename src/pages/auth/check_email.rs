use crate::errors::AppError;
use crate::ui::misc::MetaTags;
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;

#[server(CheckEmail, prefix = "/api/auth", endpoint = "confirm-email")]
pub async fn confirm_email(token: Option<String>) -> Result<Option<()>, AppError> {
    use crate::database::models::accounts::{Otp, OtpKind};
    use crate::state::AppState;

    if let Some(token) = token {
        let state = expect_context::<AppState>();
        let account = match Otp::validate(token, OtpKind::EmailConfirmation, &state.db).await {
            Ok(account) => account,
            Err(e) => return Err(e),
        };

        account.confirm(&state.db).await.map(|_| Some(()))
    } else {
        Ok(None)
    }
}

#[component]
pub fn CheckEmailPage() -> impl IntoView {
    let query = leptos_router::hooks::use_query_map();
    let token = move || query.with(|q| q.get("token"));

    let check_token = Resource::new(token, |token| async move { confirm_email(token).await });

    view! {
        <MetaTags
            url="https://offprint.cafe/check-email"
            title="Check Your Email — Offprint"
            description="For The Stories Left Untold"
            image_url="/images/beatriz.png"
        />

        <div class="flex flex-col items-center justify-center bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit overflow-y-scroll scrollbar-none" style="box-shadow: var(--dropshadow);">
            <Suspense
                fallback=move || view! {
                    <div class="flex flex-col items-center justify-center">
                        <h1 class="text-3xl">"Verifying Email"</h1>
                        <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold items-center pb-8 font-header">
                            "Getting all your ducks in a row ..."
                        </span>
                        <span><Icon icon=TablerIcon::TbLoaderOutline width="150px" height="150px" attr:class="animate-spin" /></span>
                    </div>
                }
            >
                <div class="flex flex-col items-center justify-center">
                    {move || {
                        check_token.get().map(|result| {
                            if result.clone().is_ok_and(|res| res.is_some()) {
                                view! {
                                    <h1 class="text-3xl">"All good!"</h1>
                                    <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pb-8 font-header">
                                        "You're all set to log on in."
                                    </span>
                                    <span><Icon icon=TablerIcon::TbCircleCheckOutline width="150px" height="150px" attr:class="text-green-500" /></span>
                                    <A attr:class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href="/log-in">
                                        "Ready to get started?"
                                    </A>
                                }.into_any()
                            } else if result.clone().is_ok_and(|res| res.is_none()) {
                                view! {
                                    <h1 class="text-3xl">"Check your inbox!"</h1>
                                    <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pb-8 font-header">
                                        "We've sent a confirmation email."
                                    </span>
                                    <span><Icon icon=TablerIcon::TbMailCheckOutline width="150px" height="150px" /></span>
                                    <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pt-8 font-header">
                                        "Your account will remain locked" <br/> "until you confirm it."
                                    </span>
                                    <A attr:class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href="/log-in">
                                        "After that, just log on in!"
                                    </A>
                                }.into_any()
                            } else {
                                view! {
                                    <h1 class="text-3xl text-center mb-2">"There's something not quite right..."</h1>
                                    <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pb-8 font-header">
                                        "Seems like something went wrong on our end."
                                    </span>
                                    <span><Icon icon=TablerIcon::TbAlertCircleOutline width="150px" height="150px" attr:class="text-red-500" /></span>
                                }.into_any()
                            }
                        })
                    }}
                </div>
            </Suspense>
        </div>
    }
}
