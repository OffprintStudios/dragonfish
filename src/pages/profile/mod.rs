mod blog_view;
mod blogs;
mod followers;
mod following;
mod home;
mod settings;
mod shelves;
mod works;

use codee::string::JsonSerdeCodec;
use leptos::prelude::*;
use leptos::server_fn::codec::GetUrl;
use leptos_router::components::{Outlet, ParentRoute, Route};
use leptos_router::hooks::{use_params_map, use_url};
use leptos_router::{path, MatchNestedRoutes, SsrMode};
use leptos_use::storage::{use_local_storage_with_options, UseStorageOptions};

use crate::app::AppResult;
use crate::context::AuthContext;
use crate::database::models::profiles::ProfileObject;
use crate::errors::ErrorTemplate;
use crate::ui::misc::MetaTags;
use crate::ui::nav::{MobileProfileNav, ProfileNav};

use blogs::ProfileBlogsPage;
use followers::ProfileFollowersPage;
use following::ProfileFollowingPage;
use home::ProfileHomePage;
use settings::ProfileSettingsPage;
use shelves::ProfileShelvesPage;
use works::ProfileWorksPage;

#[component(transparent)]
pub fn ProfileRoutes() -> impl MatchNestedRoutes + Clone {
    view! {
        <ParentRoute path=path!("/profile/:id/:username") view=ProfileLayout ssr=SsrMode::Async>
            <Route path=path!("works") view=ProfileWorksPage />
            <Route path=path!("blogs") view=ProfileBlogsPage />
            <Route path=path!("followers") view=ProfileFollowersPage />
            <Route path=path!("following") view=ProfileFollowingPage />
            <Route path=path!("shelves") view=ProfileShelvesPage />
            <Route path=path!("settings") view=ProfileSettingsPage />
            <Route path=path!("") view=ProfileHomePage />
        </ParentRoute>
    }
    .into_inner()
}

#[server(prefix = "/api", endpoint = "profile", input = GetUrl)]
async fn load_profile(id: String) -> AppResult<ProfileObject> {
    use crate::database::models::profiles::Profile;
    use crate::state::AppState;

    let state = expect_context::<AppState>();
    Ok(Profile::fetch_one(id, &state.db)
        .await?
        .to_object(&state.db)
        .await)
}

#[component]
fn ProfileLayout() -> impl IntoView {
    let params = use_params_map();
    let id = move || params().get("id").unwrap();
    let profile = Resource::new_blocking(
        id,
        |profile_id| async move { load_profile(profile_id).await },
    );
    let _url = use_url();

    let layout = Suspend::new(async move {
        profile.await.map(|result| {
            let (profile, _) = signal(result);
            let (is_author, set_is_author) = signal(false);
            let (auth, _, _) = use_local_storage_with_options::<AuthContext, JsonSerdeCodec>(
                "auth",
                UseStorageOptions::default().delay_during_hydration(true),
            );

            provide_context(profile);

            Effect::new(move |_| {
                set_is_author(auth().active_profile.is_some_and(|p| p.id == profile().id));
            });

            let p = profile.get_untracked();

            view! {
                <MetaTags
                    url=format!("https://offprint.cafe/profile/{}/{}", p.id, slug::slugify(&p.username))
                    title=format!("{}'s Profile — Offprint", p.username)
                    description=p.bio
                    image_url=p.avatar
                />

                <div class="w-full">
                    <div class="relative w-full h-40 md:h-80 bg-accent-dark">
                        <Show
                            when=move || profile().banner_art.is_some()
                        >
                            <img src=move || profile().banner_art.unwrap_or_default() class="object-cover w-full h-full" alt=format!("{}'s banner", profile().username) />
                        </Show>
                    </div>

                    // Mobile header
                    <MobileProfileNav
                        profile
                        is_author
                    />

                    // Desktop header
                    <ProfileNav
                        profile
                        is_author
                    >
                        <Outlet />
                    </ProfileNav>
                </div>
            }
        })
    });

    view! {
        <ErrorBoundary fallback=move |errors| view! { <ErrorTemplate errors /> }.into_view()>
            <Suspense>
                {layout}
            </Suspense>
        </ErrorBoundary>
    }
}
