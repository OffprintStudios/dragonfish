use crate::database::models::util::slogans::DEFAULT_SLOGANS;
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;

#[component]
pub fn SearchBar() -> impl IntoView {
    let curr_slogan = lazyrand::choice(&DEFAULT_SLOGANS).unwrap_or("For The Stories Left To Tell");

    view! {
        <div class="w-full relative">
            <button
                class="hidden lg:flex w-11/12 h-9 mx-auto items-center justify-center rounded-xl border-2 border-x-transparent border-t-transparent border-zinc-300 bg-zinc-300/40 backdrop-blur py-1 text-white transition firefox:bg-accent-light hover:firefox:bg-accent-light/75"
            >
                <span class="mr-2 relative"><Icon icon=TablerIcon::TbSearchOutline /></span>
                <span class="text-xs">{curr_slogan}</span>
            </button>
        </div>
    }
}
