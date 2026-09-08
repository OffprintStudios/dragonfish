use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;

#[component]
pub fn Sidebar() -> impl IntoView {
    view! {
        <div class="hidden md:flex flex-col items-center justify-start w-[67px] h-full px-0 py-3 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg z-50 border-t-0 border-r default-shadow border-white/25 text-[lightgrey] dark:text-white">
            <A
                attr:class="flex flex-col items-center justify-center h-[50px] w-[50px] md:h-[60px] md:w-[60px] mb-0.5 rounded-xl transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                exact=true
                href="/"
            >
                <span class="relative md:top-[0.165rem]"><Icon icon=TablerIcon::TbCompassOutline width="2rem" height="2rem" style="stroke-width: 1.5;" /></span>
                <span class="hidden md:block all-small-caps text-xs font-bold relative -top-0.5">"Explore"</span>
            </A>
            <A
                attr:class="flex flex-col items-center justify-center h-[50px] w-[50px] md:h-[60px] md:w-[60px] mb-0.5 rounded-xl transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                href="/social"
            >
                <span class="relative md:top-[0.165rem]"><Icon icon=TablerIcon::TbMessageChatbotOutline width="2rem" height="2rem" style="stroke-width: 1.5;" /></span>
                <span class="hidden md:block all-small-caps text-xs font-bold relative -top-0.5">"Social"</span>
            </A>
            <A
                attr:class="flex flex-col items-center justify-center h-[50px] w-[50px] md:h-[60px] md:w-[60px] mb-0.5 rounded-xl transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                href="/library"
            >
                <span class="relative md:top-[0.165rem]"><Icon icon=TablerIcon::TbBooksOutline width="2rem" height="2rem" style="stroke-width: 1.5;" /></span>
                <span class="hidden md:block all-small-caps text-xs font-bold relative -top-0.5">"Library"</span>
            </A>
            <A
                attr:class="flex md:hidden flex-col items-center justify-center h-[50px] w-[50px] md:h-[60px] md:w-[60px] mb-0.5 rounded-xl transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                href="/create"
            >
                <span class="relative md:top-[0.165rem]"><Icon icon=TablerIcon::TbLoaderOutline width="2rem" height="2rem" style="stroke-width: 1.5;" /></span>
            </A>
        </div>
    }
}
