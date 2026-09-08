mod home;
pub mod search;

pub use home::HomePage;

use crate::ui::nav::{MobileNav, Sidebar, Topbar};
use leptos::prelude::*;
use leptos_router::components::Outlet;

#[component]
pub fn BaseLayout() -> impl IntoView {
    view! {
        <Topbar />
        <div class="flex flex-col-reverse md:flex-row h-[calc(100svh-56px)] w-full">
            <Sidebar />
            <MobileNav />
            <div class="overflow-y-scroll flex-1 pb-24 md:pb-12 scrollbar-none">
                <Outlet />
            </div>
        </div>
    }
}
