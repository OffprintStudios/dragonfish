use chrono::{DateTime, Local};
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_url;

use crate::database::models::profiles::ProfileObject;
use crate::ui::misc::{Button, LinkBlock, RoleBadge};
use crate::util::functions::{abbreviate, pluralize};

#[component]
pub fn ProfileNav(
    #[prop(into)] profile: ReadSignal<ProfileObject>,
    #[prop(into)] is_author: ReadSignal<bool>,
    children: Children,
) -> impl IntoView {
    let url = use_url();

    view! {
        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 max-w-7xl md:w-11/12 mx-auto">
            <div class="flex flex-col bg-zinc-200/50 dark:bg-zinc-700/50 md:h-fit md:rounded-xl px-4 pt-2 md:py-4 relative md:bottom-24 col-span-1 backdrop-blur-lg border-b md:border border-zinc-600/25 dark:border-zinc-300/25" style="box-shadow: var(--dropshadow);">
                <div class="self-center hidden md:block max-w-[260px] max-h-[260px] rounded-full overflow-hidden border-4 border-zinc-300 dark:border-zinc-600 mb-4">
                    <img src=move || profile().avatar class="w-full h-full object-cover" alt=move || format!("{}'s avatar", profile().username) />
                </div>
                <h1 class="text-4xl">{move || profile().username}</h1>
                <div class="my-1"><RoleBadge roles=profile.get_untracked().roles /></div>
                <div class="flex items-center text-zinc-500 dark:text-zinc-400 text-xs md:text-sm">
                    <A href=move || format!("/profile/{}/{}/followers", profile().id, slug::slugify(profile().username))>
                        {move || format!("{} follower{}", abbreviate(profile().followers), pluralize(profile().followers))}
                    </A>
                    <span class="mx-1">"•"</span>
                    <A href=move || format!("/profile/{}/{}/following", profile().id, slug::slugify(profile().username))>
                        {move || format!("{} following", abbreviate(profile().following))}
                    </A>
                    <span class="flex-1"></span>
                    <span class="block md:hidden">
                        {move || {
                            let local: DateTime<Local> = DateTime::from(profile().created_at);
                            format!("Joined {}", local.format("%B %e, %Y"))
                        }}
                    </span>
                </div>
                <div class="my-2"></div>
                <span class="text-sm">{move || profile().bio}</span>
                <div class="hidden md:block my-2"></div>
                <Show
                    when=move || is_author()
                    fallback=move || view! {
                        <div class="hidden md:flex items-center w-full">
                            <Button
                                id="follow-button"
                                title="Follow"
                                full_width=true
                                primary=true
                            >
                                <span class="button-icon"><Icon icon=TablerIcon::TbUserHeartOutline /></span>
                                <span class="button-text">"Follow"</span>
                            </Button>
                            <div class="mx-0.5"></div>
                            <Button
                                id="message-button"
                                title="Message"
                            >
                                <span class="button-icon no-text"><Icon icon=TablerIcon::TbMailShareOutline /></span>
                            </Button>
                            <div class="mx-0.5"></div>
                            <Button
                                id="report-button"
                                title="Report"
                            >
                                <span class="button-icon no-text"><Icon icon=TablerIcon::TbMessageReportOutline /></span>
                            </Button>
                        </div>
                    }
                >
                    <div class="hidden md:flex items-center w-full bg-zinc-300/50 dark:bg-zinc-600/50 backdrop-blur-sm rounded-xl overflow-hidden">
                        <LinkBlock
                            id="profile-settings-link"
                            title="Profile Settings"
                            href="/settings/profiles"
                            full_width=true
                        >
                            <span class="button-icon"><Icon icon=TablerIcon::TbSettingsOutline /></span>
                            <span class="button-text">"Settings"</span>
                        </LinkBlock>
                    </div>
                </Show>
                <div class="hidden md:block my-2"></div>
                <div class="hidden md:flex items-center text-sm">
                    <span class="mr-2 relative top-0.5"><Icon icon=TablerIcon::TbCakeOutline width="22px" height="22px" /></span>
                    <span>
                        {move || {
                            let local: DateTime<Local> = DateTime::from(profile().created_at);
                            format!("Joined {}", local.format("%B %e, %Y"))
                        }}
                    </span>
                </div>
                <div class="flex md:flex-col items-center md:items-baseline mt-4 md:mt-0">
                    // TODO: links
                </div>

                // Mobile Nav
                <div class="md:hidden my-1"></div>
                <div class="flex md:hidden items-center justify-center w-full">
                    <A
                        href=move || format!("/profile/{}/{}", profile().id, slug::slugify(profile().username))
                        attr:class="w-1/4 text-center py-2 mx-0.5 all-small-caps text-lg font-bold tracking-wide border-b-2 border-transparent transition [&[aria-current=page]]:border-zinc-700 dark:[&[aria-current=page]]:border-zinc-300"
                    >
                        <span>"Home"</span>
                    </A>
                    <A
                        href=move || format!("/profile/{}/{}/works", profile().id, slug::slugify(profile().username))
                        attr:class="w-1/4 text-center py-2 mx-0.5 all-small-caps text-lg font-bold tracking-wide border-b-2 border-transparent transition [&[aria-current=page]]:border-zinc-700 dark:[&[aria-current=page]]:border-zinc-300"
                    >
                        <span>"Works"</span>
                    </A>
                    <A
                        href=move || format!("/profile/{}/{}/blogs", profile().id, slug::slugify(profile().username))
                        attr:class="w-1/4 text-center py-2 mx-0.5 all-small-caps text-lg font-bold tracking-wide border-b-2 border-transparent transition [&[aria-current=page]]:border-zinc-700 dark:[&[aria-current=page]]:border-zinc-300"
                    >
                        <span>"Blogs"</span>
                    </A>
                    <A
                        href=move || format!("/profile/{}/{}/shelves", profile().id, slug::slugify(profile().username))
                        attr:class="w-1/4 text-center py-2 mx-0.5 all-small-caps text-lg font-bold tracking-wide border-b-2 border-transparent transition [&[aria-current=page]]:border-zinc-700 dark:[&[aria-current=page]]:border-zinc-300"
                    >
                        <span>"Shelves"</span>
                    </A>
                </div>
            </div>
            <div class="mb-6 md:my-6 col-span-3">
                <div
                    class="hidden md:flex items-center justify-center w-full py-2 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg rounded-xl border border-zinc-600/25 dark:border-zinc-300/25 transition"
                    class:no-bottom-border=move || { url().path().contains("/works") || url().path().contains("/blogs") }
                    style="box-shadow: var(--dropshadow);"
                >
                    <A
                        href=move || format!("/profile/{}/{}", profile().id, slug::slugify(profile().username))
                        exact=true
                        attr:class="flex items-center justify-center px-6 py-3 mx-1 rounded-xl all-small-caps text-lg font-bold tracking-wide transition [&[aria-current=page]]:bg-zinc-300/50 dark:[&[aria-current=page]]:bg-zinc-600/50 [&[aria-current=page]]:backdrop-blur-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 hover:backdrop-blur-sm"
                    >
                        <span class="relative mr-2"><Icon icon=TablerIcon::TbHomeOutline width="20px" height="20px" /></span>
                        <span>"Home"</span>
                    </A>
                    <A
                        href=move || format!("/profile/{}/{}/works", profile().id, slug::slugify(profile().username))
                        attr:class="flex items-center justify-center px-6 py-3 mx-1 rounded-xl all-small-caps text-lg font-bold tracking-wide transition [&[aria-current=page]]:bg-zinc-300/50 dark:[&[aria-current=page]]:bg-zinc-600/50 [&[aria-current=page]]:backdrop-blur-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 hover:backdrop-blur-sm"
                    >
                        <span class="relative mr-2"><Icon icon=TablerIcon::TbFeatherOutline width="20px" height="20px" /></span>
                        <span>{move || format!("{} Work{}", abbreviate(profile().works), pluralize(profile().works))}</span>
                    </A>
                    <A
                        href=move || format!("/profile/{}/{}/blogs", profile().id, slug::slugify(profile().username))
                        attr:class="flex items-center justify-center px-6 py-3 mx-1 rounded-xl all-small-caps text-lg font-bold tracking-wide transition [&[aria-current=page]]:bg-zinc-300/50 dark:[&[aria-current=page]]:bg-zinc-600/50 [&[aria-current=page]]:backdrop-blur-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 hover:backdrop-blur-sm"
                    >
                        <span class="relative mr-2"><Icon icon=TablerIcon::TbCoffeeOutline width="20px" height="20px" /></span>
                        <span>{move || format!("{} Blog{}", abbreviate(profile().blogs), pluralize(profile().blogs))}</span>
                    </A>
                    <A
                        href=move || format!("/profile/{}/{}/shelves", profile().id, slug::slugify(profile().username))
                        attr:class="flex items-center justify-center px-6 py-3 mx-1 rounded-xl all-small-caps text-lg font-bold tracking-wide transition [&[aria-current=page]]:bg-zinc-300/50 dark:[&[aria-current=page]]:bg-zinc-600/50 [&[aria-current=page]]:backdrop-blur-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 hover:backdrop-blur-sm"
                    >
                        <span class="relative mr-2"><Icon icon=TablerIcon::TbBooksOutline width="20px" height="20px" /></span>
                        <span>"Shelves"</span>
                    </A>
                </div>
                <div class="w-full mx-auto">
                    {children()}
                </div>
            </div>
        </div>
    }
}
