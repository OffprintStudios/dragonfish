mod constitution;
mod omnibus;
mod privacy_policy;
mod tos;

use leptos::prelude::*;
use leptos_router::components::{Outlet, ParentRoute, Route};
use leptos_router::{path, MatchNestedRoutes};

use constitution::ConstitutionPage;
use omnibus::OmnibusPage;
use privacy_policy::PrivacyPolicyPage;
use tos::TosPage;

#[component(transparent)]
pub fn DocsRoutes() -> impl MatchNestedRoutes + Clone {
    view! {
        <ParentRoute path=path!("/docs") view=DocsLayout>
            <Route path=path!("constitution") view=ConstitutionPage />
            <Route path=path!("omnibus") view=OmnibusPage />
            <Route path=path!("privacy-policy") view=PrivacyPolicyPage />
            <Route path=path!("tos") view=TosPage />
        </ParentRoute>
    }
    .into_inner()
}

#[component]
fn DocsLayout() -> impl IntoView {
    view! { <Outlet /> }
}
