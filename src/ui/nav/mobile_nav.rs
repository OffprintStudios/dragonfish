use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;

#[component]
pub fn MobileNav() -> impl IntoView {
    view! {
        <div class="fixed md:hidden w-full z-100 text-[lightgrey] dark:text-white">
            <div class="flex items-center justify-between w-11/12 mx-auto mb-8 rounded-full h-[67px] px-2.5 pb-2.5 pt-3 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg z-50 border default-shadow border-white/25">
                <A
                    attr:class="flex flex-col items-center justify-center h-[50px] w-[50px] mb-0.5 rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                    exact=true
                    href="/"
                >
                    <span class="relative"><Icon icon=TablerIcon::TbCompassOutline width="2rem" height="2rem" style="stroke-width: 1.5;" /></span>
                </A>
                <A
                    attr:class="flex flex-col items-center justify-center h-[50px] w-[50px] mb-0.5  rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                    href="/social"
                >
                    <span class="relative"><Icon icon=TablerIcon::TbMessageChatbotOutline width="2rem" height="2rem" style="stroke-width: 1.5;" /></span>
                </A>
                <A
                    attr:class="flex flex-col items-center justify-center h-[50px] w-[50px] mb-0.5 rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                    href="/create"
                >
                    <span class="relative"><Icon icon=TablerIcon::TbLoaderOutline width="2rem" height="2rem"  style="stroke-width: 1.5;" /></span>
                </A>
                <A
                    attr:class="flex flex-col items-center justify-center h-[50px] w-[50px] mb-0.5  rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                    href="/library"
                >
                    <span class="relative"><Icon icon=TablerIcon::TbBooksOutline width="2rem" height="2rem" style="stroke-width: 1.5;" /></span>
                </A>
                <A
                    attr:class="flex flex-col items-center justify-center h-[50px] w-[50px] mb-0.5 rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
                    href="/search"
                >
                    <span class="relative"><Icon icon=TablerIcon::TbSearchOutline width="2rem" height="2rem"  style="stroke-width: 1.5;" /></span>
                </A>
            </div>
        </div>
    }
}
