use crate::ui::content::{WorkCard, WorkCardWidth};
use crate::ui::misc::MetaTags;
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;

#[component]
pub fn ExplorePage() -> impl IntoView {
    view! {
        <MetaTags
            url="https://offprint.cafe/explore"
            title="Explore — Offprint"
            description="For The Stories Left Untold"
            image_url="/images/beatriz.png"
        />

        <div>
            <div
                class="sticky top-[56px] flex w-full mb-8 h-[50px] md:h-[55px] backdrop-blur-lg z-10 border-b border-opacity-25 bg-zinc-200/50 dark:bg-zinc-700/50 border-zinc-700/25 dark:border-zinc-200/25 scrollbar-none"
                style="box-shadow: var(--dropshadow);"
            >
                <div
                    class="flex justify-start md:justify-center w-full max-w-7xl mx-auto overflow-y-scroll shrink-0"
                    style="scrollbar-width: none; -ms-overflow-style: none;"
                >
                    <div class="flex shrink-0 items-center justify-center px-3 h-full all-small-caps font-bold tracking-wider text-lg border-r last:border-r-0 border-zinc-700/25 dark:border-zinc-200/25">
                        <span class="relative top-0.5 mr-1">
                            <Icon icon=TablerIcon::TbAppsOutline />
                        </span>
                        <span>"All Works"</span>
                    </div>
                    <div class="flex shrink-0 items-center justify-center px-3 h-full all-small-caps font-bold tracking-wider text-lg border-r last:border-r-0 border-zinc-700/25 dark:border-zinc-200/25">
                        <span class="relative top-0.5 mr-1">
                        <Icon icon=TablerIcon::TbLoaderOutline />
                        </span>
                        <span>"Newest"</span>
                    </div>
                    <div class="flex shrink-0 items-center justify-center px-3 h-full all-small-caps font-bold tracking-wider text-lg border-r last:border-r-0 border-zinc-700/25 dark:border-zinc-200/25">
                        <span class="relative top-0.5 mr-1">
                            <Icon icon=TablerIcon::TbBoxOutline />
                        </span>
                        <span>"All Genres"</span>
                    </div>
                    <div class="flex shrink-0 items-center justify-center px-3 h-full all-small-caps font-bold tracking-wider text-lg border-r last:border-r-0 border-zinc-700/25 dark:border-zinc-200/25">
                        <span class="relative top-0.5 mr-1">
                            <Icon icon=TablerIcon::TbSparklesOutline />
                        </span>
                        <span>"All Ratings"</span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-11/12 mx-auto max-w-7xl mb-8">
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
                <WorkCard width=WorkCardWidth::Auto />
            </div>
        </div>
    }
}
