pub mod auth;
pub mod docs;
pub mod explore;
mod home;
pub mod library;
pub mod profile;
pub mod search;
pub mod social;

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
