use crate::errors::ErrorTemplate;
use crate::pages::auth::validate;
use crate::ui::misc::MetaTags;
use leptos::prelude::*;
use leptos_router::SsrMode;
use leptos_router::{components::Route, path, MatchNestedRoutes};

#[component(transparent)]
pub fn LibraryRoutes() -> impl MatchNestedRoutes + Clone {
    view! {
        <Route path=path!("/library") view=LibraryLayout ssr=SsrMode::Async />
    }
    .into_inner()
}

#[component]
fn LibraryLayout() -> impl IntoView {
    let validation = Resource::new_blocking(|| (), |_| validate());
    let is_valid = move || {
        Suspend::new(async move {
            validation.await.map(|_| {
                view! {
                    <span class="hidden">"authorized"</span>
                }
            })
        })
    };

    view! {
        <ErrorBoundary fallback=move |errors| view! { <ErrorTemplate errors /> }.into_view()>
            <MetaTags
                url="https://offprint.cafe/library"
                title="Library — Offprint"
                description="For The Stories Left Untold"
                image_url="/images/beatriz.png"
            />

            <div class="empty">
                <h3>"Nothing To See Here"</h3>
                <p>"This page is still under construction!"</p>
            </div>
            {is_valid}
        </ErrorBoundary>
    }
}
