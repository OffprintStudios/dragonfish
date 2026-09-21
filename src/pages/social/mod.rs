use leptos::prelude::*;
use leptos_router::{components::Route, path, MatchNestedRoutes};

#[component(transparent)]
pub fn SocialRoutes() -> impl MatchNestedRoutes + Clone {
    view! {
        <Route path=path!("/social") view=SocialPage />
    }
    .into_inner()
}

#[component]
fn SocialPage() -> impl IntoView {
    view! {
        <div class="empty">
            <h3>"Nothing To See Here"</h3>
            <p>"This page is still under construction!"</p>
        </div>
    }
}
