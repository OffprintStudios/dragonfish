use crate::ui::content::{CardCarousel, GenreGrid, Jumbotron, NewsPanel};
use crate::ui::misc::MetaTags;
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;

#[component]
pub fn HomePage() -> impl IntoView {
    view! {
        <MetaTags
            url="https://offprint.cafe/"
            title="Home — Offprint"
            description="For The Stories Left Untold"
            image_url="/images/beatriz.png"
        />

        <div class="mb-6 md:my-12">
            <Jumbotron />
        </div>

        <div class="flex flex-col max-w-6xl mx-auto w-full md:w-11/12 my-6">
            <CardCarousel>
                <Icon icon=TablerIcon::TbSparklesOutline width="30px" height="30px" />
                <h3 class="text-xl md:text-2xl text-black! dark:text-white! mx-2">"What's New"</h3>
            </CardCarousel>
            <div class="my-4">/* spacer */</div>
            <CardCarousel>
                <Icon icon=TablerIcon::TbBuildingBroadcastTowerOutline width="30px" height="30px" />
                <h3 class="text-xl md:text-2xl text-black! dark:text-white! mx-2">"Recently Updated"</h3>
            </CardCarousel>
            <div class="my-4">/* spacer */</div>
            <NewsPanel />
            <GenreGrid />
        </div>
    }
}
