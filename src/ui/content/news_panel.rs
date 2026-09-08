use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;

#[component]
pub fn NewsPanel() -> impl IntoView {
    view! {
        <div class="w-full">
            <div class="flex items-center mx-4 md:mx-0 mb-2">
                <Icon icon=TablerIcon::TbNewsOutline width="30px" height="30px" />
                <h3 class="text-xl md:text-2xl text-black! dark:text-white! ml-2">"News & Updates"</h3>
                <div class="flex-1">/* spacer */</div>
                <span class="all-small-caps md:text-xl font-semibold text-sm tracking-wide relative -top-[0.075rem]">"More"</span>
                <Icon icon=TablerIcon::TbChevronRightOutline width="30px" height="30px" />
            </div>
            <div class="grid grid-cols-1 grid-rows-6 md:grid-rows-3 md:grid-cols-2 gap-4 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur border border-zinc-600/25 dark:border-zinc-300/25 md:rounded-xl p-4 mb-8" style="box-shadow: var(--dropshadow);">
                <div class="flex flex-col row-span-3 rounded-xl overflow-hidden hover:bg-zinc-300 dark:hover:bg-zinc-600 transition group">
                    <div class="w-full h-[170px]">
                        <img src="https://images.offprint.net/cover-pics/2ieX51ucz-f6097ebd-2107-486d-9958-e80123439d69.jpg" class="object-cover w-full h-full rounded-b-xl group-hover:rounded-b-none" />
                    </div>
                    <div class="flex flex-col mt-4 ml-2.5">
                        <h5 class="text-black! dark:text-white! text-2xl">"Offprint Presents: Some Other Thing"</h5>
                        <span class="text-zinc-400 font-header">"by Figments • Oct 7, 2023"</span>
                    </div>
                </div>
                <div class="flex items-center rounded-xl overflow-hidden hover:bg-zinc-300 dark:hover:bg-zinc-600 transition group">
                    <div class="w-[100px] h-[75px]">
                        <img src="https://images.offprint.net/cover-pics/2ieX51ucz-f6097ebd-2107-486d-9958-e80123439d69.jpg" class="object-cover w-full h-full rounded-r-xl group-hover:rounded-r-none" />
                    </div>
                    <div class="flex flex-col ml-2.5">
                        <h5 class="text-black! dark:text-white! text-xl">"Offprint Presents: Some Other Thing"</h5>
                        <span class="text-zinc-400 font-header">"by Figments • Oct 7, 2023"</span>
                    </div>
                </div>
                <div class="flex items-center rounded-xl overflow-hidden hover:bg-zinc-300 dark:hover:bg-zinc-600 transition group">
                    <div class="w-[100px] h-[75px]">
                        <img src="https://images.offprint.net/cover-pics/2ieX51ucz-f6097ebd-2107-486d-9958-e80123439d69.jpg" class="object-cover w-full h-full rounded-r-xl group-hover:rounded-r-none" />
                    </div>
                    <div class="flex flex-col ml-2.5">
                        <h5 class="text-black! dark:text-white! text-xl">"Offprint Presents: Some Other Thing"</h5>
                        <span class="text-zinc-400 font-header">"by Figments • Oct 7, 2023"</span>
                    </div>
                </div>
                <div class="flex items-center rounded-xl overflow-hidden hover:bg-zinc-300 dark:hover:bg-zinc-600 transition group">
                    <div class="w-[100px] h-[75px]">
                        <img src="https://images.offprint.net/cover-pics/2ieX51ucz-f6097ebd-2107-486d-9958-e80123439d69.jpg" class="object-cover w-full h-full rounded-r-xl group-hover:rounded-r-none" />
                    </div>
                    <div class="flex flex-col ml-2.5">
                        <h5 class="text-black! dark:text-white! text-xl">"Offprint Presents: Some Other Thing"</h5>
                        <span class="text-zinc-400 font-header">"by Figments • Oct 7, 2023"</span>
                    </div>
                </div>
            </div>
        </div>
    }
}
