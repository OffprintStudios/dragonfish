pub mod auth;
mod home;
pub mod search;

pub use home::HomePage;

use crate::ui::nav::{MobileNav, NavigationBar};
use leptos::prelude::*;
use leptos_router::components::Outlet;

#[component]
pub fn BaseLayout() -> impl IntoView {
    view! {
        <NavigationBar />
        <MobileNav />
        <Outlet />
    }
}
