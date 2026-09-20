use crate::errors::ErrorTemplate;
use crate::ui::misc::MetaTags;
use crate::{app::AppResult, context::AuthContext};
use codee::string::JsonSerdeCodec;
use icondata as TablerIcon;
use leptos::either::Either;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_navigate;
use leptos_use::storage::use_local_storage;

#[server(prefix = "/api", endpoint = "account")]
pub async fn load_account() -> AppResult<AuthContext> {
    use crate::database::models::accounts::Session;

    Session::get_auth_context().await
}

#[component]
pub fn SwitchProfilePage() -> impl IntoView {
    let load_account = Resource::new_blocking(|| (), |_| load_account());
    let (_, set_auth, _) = use_local_storage::<AuthContext, JsonSerdeCodec>("auth");
    let count = RwSignal::<usize>::new(0);

    let profiles = move || {
        Suspend::new(async move {
            load_account.await.map(|auth_context| {
                count.set(auth_context.all_profiles.len());
                set_auth.set(auth_context.clone());

                if auth_context.all_profiles.is_empty() {
                    Either::Left(view! { <span></span> })
                } else {
                    Either::Right(auth_context.all_profiles.iter().map(move |profile| {
                        let p = profile.clone();

                        view! {
                            <button
                                class="flex flex-col items-center rounded-xl p-4 mx-2 w-[180px] h-[210px] hover:bg-zinc-300 dark:hover:bg-zinc-600 transition cursor-pointer"
                                on:click=move |_| {
                                    let navigate = use_navigate();
                                    set_auth.update(|auth| {
                                        auth.active_profile = Some(p.clone());
                                    });
                                    navigate("/", Default::default());
                                }
                            >
                                <img class="rounded-full border-2 object-cover w-[125px] h-[125px]" src=profile.avatar.clone() alt=format!("{}'s Avatar", profile.username.clone()) />
                                <span class="pt-3 all-small-caps font-semibold tracking-wide text-xl truncate max-w-[120px]">
                                    {profile.username.clone()}
                                </span>
                            </button>
                        }
                    }).collect::<Vec<_>>())
                }
            })
        })
    };

    view! {
        <MetaTags
            url="https://offprint.cafe/switch-profile"
            title="Switch Profile — Offprint"
            description="For The Stories Left Untold"
            image_url="/images/beatriz.png"
        />

        <ErrorBoundary fallback=move |errors| view! { <ErrorTemplate errors /> }.into_view()>
            <div class="flex flex-col items-center justify-center bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg border border-zinc-300/25 dark:border-zinc-600/25 md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit" style="box-shadow: var(--dropshadow);">
                <div class="flex flex-col items-center justify-center pb-4">
                    <h1 class="text-3xl">"Select a Profile"</h1>
                    <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold font-header">
                        "Who's gonna be with us today?"
                    </span>
                </div>
                <div class="flex items-center justify-center w-full">
                    {profiles}
                    <Show
                        when=move || count() < 3
                    >
                        <A
                            attr:class="flex flex-col items-center rounded-xl p-4 mx-2 w-[180px] h-[210px] hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                            href="/create-profile"
                        >
                            <div class="flex flex-col items-center justify-center w-[125px] h-[125px] rounded-full border-2 border-dotted">
                                <Icon icon=TablerIcon::TbUserPlusOutline width="48px" height="48px" />
                            </div>
                            <span class="pt-3 all-small-caps font-semibold text-xl tracking-wide">
                                "Add New"
                            </span>
                        </A>
                    </Show>
                </div>
            </div>
        </ErrorBoundary>
    }
}
