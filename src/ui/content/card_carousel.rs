use super::work_card::WorkCard;
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;

#[component]
pub fn CardCarousel(children: Children) -> impl IntoView {
    view! {
        <div>
            <div class="flex items-center mx-4 md:mx-0 mb-3">
                {children()}
                <div class="flex-1">/* spacer */</div>
                <span class="all-small-caps md:text-xl font-semibold text-sm tracking-wide relative -top-[0.075rem]">More</span>
                <Icon icon=TablerIcon::TbChevronRightOutline width="30px" height="30px" />
            </div>
            <div class="flex items-center justify-start shrink-0 w-full pb-4 md:pb-8 px-4 snap-x snap-mandatory snap-always overflow-x-scroll scrollbar-none">
                <div class="mr-2 snap-center">
                    <WorkCard />
                </div>
                <div class="mr-2 snap-center">
                    <WorkCard />
                </div>
                <div class="mr-2 snap-center">
                    <WorkCard />
                </div>
                <div class="mr-2 snap-center">
                    <WorkCard />
                </div>
                <div class="mr-2 snap-center">
                    <WorkCard />
                </div>
                <div class="mr-2 snap-center">
                    <WorkCard />
                </div>
                <div class="mr-2 snap-center">
                    <WorkCard />
                </div>
                <div class="mr-2 snap-center">
                    <WorkCard />
                </div>
                <div class="snap-center">
                    <WorkCard />
                </div>
            </div>
        </div>
    }
}
