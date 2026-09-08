use crate::database::models::content::works::Genre;
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;
use strum::IntoEnumIterator;

#[component]
pub fn GenreGrid() -> impl IntoView {
    view! {
        <div>
            <div class="flex items-center mb-3 mx-4 md:mx-0">
                <Icon icon=TablerIcon::TbCubeOutline width="30px" height="30px" />
                <h3 class="text-xl md:text-2xl text-black! dark:text-white! mx-2">"Genres"</h3>
                <div class="flex-1">/* spacer */</div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 md:gap-2">
                {}

                <For
                    each=move || Genre::iter()
                    key=|genre| genre.to_string()
                    children=move |genre| {
                        view! {
                            <div class="flex flex-col items-center justify-center overflow-hidden px-4 py-2 border odd:border-l-0 even:border-r-0 md:odd:border-l md:even:border-r md:rounded-xl bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur border-zinc-600/25 dark:border-zinc-300/25 h-[106px]" style="box-shadow: var(--dropshadow);">
                                <span class="relative top-0.5">
                                    <Icon icon=genre.to_icon() width="36px" height="36px" />
                                </span>
                                <span class="text-center all-small-caps font-semibold wrap-break-word leading-relaxed">{genre.to_themed()}</span>
                            </div>
                        }
                    }
                />
            </div>
        </div>
    }
}
