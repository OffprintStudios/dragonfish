use super::guide::Guide;
use super::search_bar::SearchBar;
use crate::database::models::accounts::Role;
use crate::database::models::profiles::ProfileObject;
// use crate::store::auth_store::AuthStore;
use crate::ui::misc::Popup;
use crate::util::functions::intersection;
// use codee::string::JsonSerdeCodec;
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
// use leptos_use::storage::use_local_storage;
use leptos_use::use_window_scroll;
use std::ops::Not;

#[component]
pub fn Topbar() -> impl IntoView {
    let (curr_profile, _set_curr_profile) = signal::<Option<ProfileObject>>(None);
    let create_menu = RwSignal::new(false);
    let (_, _scroll_y) = use_window_scroll();

    // Effect::new(move |_| {
    //     let (auth, _, _) = use_local_storage::<AuthStore, JsonSerdeCodec>("auth");
    //     set_curr_profile(auth().current_profile);
    // });

    view! {
        <div class="sticky top-0 w-full z-50 border-b border-white/25 backdrop-blur-lg bg-accent">
            <div class="flex items-center h-[55px] mx-4 relative">
                <div class="flex items-center w-1/3">
                    <span class="mr-0.5 text-white!"><Icon icon=TablerIcon::TbLeaf2Outline width="2.25rem" height="2.25rem" style="stroke-width: 1.25;" /></span>
                    <h3 class="text-2xl font-bold tracking-tighter text-white!">"Offprint"</h3>
                </div>
                <div class="w-1/3">
                    <SearchBar />
                </div>
                <div class="w-1/3 flex items-center relative font-header">
                    <div class="flex-1"></div>
                    <Show
                        when=move || curr_profile().is_some()
                        fallback=|| view! {
                            <A
                                attr:class="flex items-center text-white p-2 rounded-xl transition hover:bg-zinc-300/25 hover:backdrop-blur"
                                href="/log-in"
                            >
                                <span class="relative"><Icon icon=TablerIcon::TbLogin2Outline width="20px" height="20px" /></span>
                                <span class="relative all-small-caps font-header font-semibold ml-1">"Log In"</span>
                            </A>
                        }
                    >
                        <button
                            class="hidden md:flex items-center text-white mx-1.5 px-3 py-1.5 rounded-full transition bg-zinc-300/25 hover:bg-zinc-300/50 hover:backdrop-blur cursor-pointer"
                            on:click=move |_| create_menu.set(true)
                        >
                            <span><Icon icon=TablerIcon::TbLoaderOutline width="20px" height="20px" /></span>
                            <span class="relative ml-1 hidden lg:block all-small-caps font-semibold font-header">"Create"</span>
                        </button>
                        <Popup
                            id="create-menu"
                            show=create_menu
                        >
                            <div class="flex flex-col items-center justify-center p-8">
                                <h1 class="text-4xl">"Create Something New"</h1>
                                <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold font-header text-center">
                                    "A whole slew of worlds bristle at your fingertips—"<br/>"Where should we begin?"
                                </span>
                                <div class="flex items-center mt-8">
                                    <A href="/create/works" attr:class="flex flex-col items-center justify-center min-w-[196px] min-h-[167px] p-8 rounded-xl bg-zinc-300/50 dark:bg-zinc-600/50 transition hover:bg-zinc-500/50 dark:hover:bg-zinc-400/50">
                                        <span><Icon icon=TablerIcon::TbFeatherOutline width="75px" height="75px" /></span>
                                        <span class="text-lg font-semibold tracking-wide all-small-caps">"Original Work"</span>
                                    </A>
                                    <div class="mx-1"></div>
                                    <A href="/create/works" attr:class="flex flex-col items-center justify-center min-w-[196px] min-h-[167px] p-8 rounded-xl bg-zinc-300/50 dark:bg-zinc-600/50 transition hover:bg-zinc-500/50 dark:hover:bg-zinc-400/50">
                                        <span><Icon icon=TablerIcon::TbMoodHappyOutline width="75px" height="75px" /></span>
                                        <span class="text-lg font-semibold tracking-wide all-small-caps">"Fan Work"</span>
                                    </A>
                                    <div class="mx-1"></div>
                                    <A href="/create/blogs" attr:class="flex flex-col items-center justify-center min-w-[196px] min-h-[167px] p-8 rounded-xl bg-zinc-300/50 dark:bg-zinc-600/50 transition hover:bg-zinc-500/50 dark:hover:bg-zinc-400/50">
                                        <span class="relative left-1.5"><Icon icon=TablerIcon::TbCoffeeOutline width="75px" height="75px" /></span>
                                        <span class="text-lg font-semibold tracking-wide all-small-caps">"Blog"</span>
                                    </A>
                                </div>
                                <A attr:class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href="/create">
                                    "See Overview"
                                </A>
                            </div>
                        </Popup>
                        <Show
                            when=move || curr_profile().is_some_and(|p| intersection(&[Role::Admin, Role::Moderator], &p.roles).is_empty().not())
                        >
                            <A
                                attr:class="flex items-center justify-center text-white mx-1.5 w-[44px] h-[44px] firefox:text-sm rounded-full transition bg-zinc-300/25 hover:bg-zinc-300/50 hover:backdrop-blur cursor-pointer"
                                href="/dashboard"
                            >
                                <span class="relative"><Icon icon=TablerIcon::TbDashboardOutline width="20px" height="20px" /></span>
                            </A>
                        </Show>
                        <Guide profile=curr_profile().unwrap() />
                    </Show>
                </div>
            </div>
        </div>
    }
}
