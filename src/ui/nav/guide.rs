use crate::database::models::profiles::ProfileObject;
use crate::ui::misc::{Button as AppButton, LinkBlock, RoleBadge};
use icondata as TablerIcon;
use leptos::either::Either;
use leptos::html::{Button, Div};
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_location;

#[derive(Debug, Clone)]
pub enum Panel {
    Main,
    Settings,
    LogOut,
}

#[component]
pub fn Guide(profile: ProfileObject) -> impl IntoView {
    let (curr_panel, set_curr_panel) = signal(Panel::Main);
    let (profile, _) = signal(profile.clone());
    let button_ref = NodeRef::<Button>::new();
    let popup_ref = NodeRef::<Div>::new();
    let window = leptos_use::use_window();
    let leptos_use::UseElementBoundingReturn { left, .. } =
        leptos_use::use_element_bounding(button_ref);
    let is_min_width = leptos_use::use_media_query("(min-width: 768px)");
    let location = use_location();

    let (offset, set_offset) = signal::<String>("0px".into());

    Effect::new(move || {
        if window.is_some() {
            let scroll_x = window.as_ref().unwrap().scroll_x().unwrap_or(0.0);
            if !is_min_width() {
                set_offset("0px".into());
            } else {
                set_offset(format!("{}px", left() + scroll_x - 335.0));
            }
        } else {
            set_offset("0px".into());
        }
    });

    Effect::new(move |_| {
        let node = popup_ref.get().expect("popup not loaded!");
        let _pathname = location.pathname.get();

        let _ = node.hide_popover();
    });

    view! {
        <button class="relative mx-1 md:mr-0 transition transform hover:scale-110 cursor-pointer" popovertarget="guide-menu" node_ref=button_ref>
            <div class="absolute z-2 top-0 right-0">
                <div class="w-[13px] h-[13px] bg-rose-500 rounded-full" style="box-shadow: var(--dropshadow);">
                    <div class="w-full h-full bg-rose-500 animate-ping rounded-full" />
                </div>
            </div>
            <div class="w-10 h-10 z-1 relative rounded-full border-2 border-white overflow-hidden">
                <img src=profile().avatar class="w-full h-full object-cover" />
            </div>
        </button>
        <div
            id="guide-menu"
            class="[&:popover-open]:inset-[unset] [&:popover-open]:top-14 md:[&:popover-open]:w-[375px] [&:popover-open]:w-full [&:popover-open]:m-0 p-0 bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur border-b md:border-x border-zinc-600/25 dark:border-zinc-300/25 md:rounded-b-xl motion-opacity-in-0 motion-blur-in-md motion-duration-200"
            style="box-shadow: var(--dropshadow); color: var(--text-color);"
            style:left=move || offset()
            popover="auto"
            node_ref=popup_ref
        >
            {move || match curr_panel() {
                Panel::Main => view! { <MainPanel profile=profile set_curr_panel /> }.into_any(),
                Panel::Settings => view! { <SettingsPanel set_curr_panel /> }.into_any(),
                Panel::LogOut => view! { <LogOutPanel set_curr_panel /> }.into_any()
            }}
        </div>
    }
}

#[component]
pub fn MainPanel(
    #[prop(into)] profile: Signal<ProfileObject>,
    set_curr_panel: WriteSignal<Panel>,
) -> impl IntoView {
    view! {
        <div class="flex flex-col items-center justify-center w-full pb-4">
            <div class="h-16 w-full">
                {move || if let Some(banner_art) = profile().banner_art{
                    Either::Left(view! {
                        <img src=banner_art class="w-full h-16 object-cover" />
                    })
                } else {
                    Either::Right(view! {
                        <div class="w-full h-28 bg-linear-to-b from-accent to-transparent"></div>
                    })
                }}
            </div>
            <div class="flex items-center w-full px-4">
                <img src=profile().avatar class="block w-20 h-20 object-cover rounded-full mr-2" />
                <div>
                    <A href=format!("/profile/{}/{}", profile().id, slug::slugify(profile().username))><h3 class="text-3xl relative top-1.5">{move || profile().username}</h3></A>
                    <RoleBadge roles=profile().roles />
                </div>
            </div>
            <div class="flex items-center w-full px-4 py-4 border-b border-zinc-300/75 dark:border-zinc-600/75">
                <LinkBlock
                    id="view-works"
                    title="View Works"
                    href=format!("/profile/{}/{}/works", profile().id, slug::slugify(profile().username))
                    primary=true
                    full_width=true
                >
                    <span class="button-icon"><Icon icon=TablerIcon::TbWritingOutline /></span>
                    <span class="button-text">"View Works"</span>
                </LinkBlock>
                <div class="mx-1"></div>
                <LinkBlock
                    id="view-blogs"
                    title="View Blogs"
                    href=format!("/profile/{}/{}/blogs", profile().id, slug::slugify(profile().username))
                    primary=true
                    full_width=true
                >
                    <span class="button-icon"><Icon icon=TablerIcon::TbCoffeeOutline /></span>
                    <span class="button-text">"View Blogs"</span>
                </LinkBlock>
            </div>
            <div class="flex flex-col w-full px-4 pt-4">
                <div class="flex flex-col w-full rounded-xl bg-zinc-300/75 dark:bg-zinc-600/75 overflow-hidden">
                    <div class="flex items-center w-full px-2 pt-2 pb-3 border-b border-zinc-500/50 dark:border-zinc-400/50">
                        <img src="/images/ashtree-lane.jpg" class="max-w-[50px] object-contain rounded-md mr-2" />
                        <div class="flex flex-col w-full">
                            <div class="flex items-center">
                                <span class="all-small-caps font-semibold tracking-wide text-sm">"Continue Reading"</span>
                                <span class="mx-1 relative">"•"</span>
                                <span class="text-xs text-zinc-500 dark:text-zinc-400 font-default relative top-[0.075rem]">"3 chapters left"</span>
                            </div>
                            <h6 class="text-lg relative -top-0.5">"The Chronicles of Ashtree Lane"</h6>
                            <span class="text-sm text-zinc-500 dark:text-zinc-400 relative -top-1.5">"by Figments"</span>
                            <progress id="reading-progress" value="73" max="100" class="w-full h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-zinc-500 dark:[&::-webkit-progress-bar]:bg-zinc-400 [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent">"73%"</progress>
                        </div>
                    </div>
                    <A href="/library" attr:class="flex items-center px-4 py-2.5 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition">
                        <span class="all-small-caps tracking-wide font-semibold text-sm">"View Library"</span>
                        <span class="flex-1"></span>
                        <span class="text-xs font-default text-zinc-500 dark:text-zinc-400">"27 updates"</span>
                        <span class="ml-0.5 text-zinc-500 dark:text-zinc-400 "><Icon icon=TablerIcon::TbBooksOutline width="1.25rem" height="1.25rem" /></span>
                    </A>
                </div>
                <div class="my-1"></div>
                <div class="flex flex-col w-full rounded-xl bg-zinc-300/75 dark:bg-zinc-600/75 overflow-hidden">
                    <A href="/messages" attr:class="flex items-center px-4 py-2.5 border-b border-zinc-500/50 dark:border-zinc-400/50 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition">
                        <span class="mr-1"><Icon icon=TablerIcon::TbMailboxOutline width="1.25rem" height="1.25rem" /></span>
                        <span class="relative -0.5 text-sm">"1.2k messages"</span>
                        <span class="flex-1"></span>
                        <span class="text-xs font-default text-zinc-500 dark:text-zinc-400">"8 unread"</span>
                    </A>
                    <A href="/notifications" attr:class="flex items-center px-4 py-2.5 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition">
                        <span class="mr-1"><Icon icon=TablerIcon::TbBellExclamationOutline width="1.25rem" height="1.25rem" /></span>
                        <span class="relative text-sm">"18 notes"</span>
                        <span class="flex-1"></span>
                        <span class="text-xs font-default text-zinc-500 dark:text-zinc-400">"3 unchecked"</span>
                    </A>
                </div>
                <div class="my-1"></div>
                <div class="flex flex-col w-full rounded-xl bg-zinc-300/75 dark:bg-zinc-600/75 overflow-hidden">
                    <A href="/switch-profile" attr:class="flex items-center px-4 py-2.5 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition">
                        <span class="mr-1"><Icon icon=TablerIcon::TbSwitch3Outline width="1.25rem" height="1.25rem" /></span>
                        <span class="relative text-sm">"Switch Profile"</span>
                        <span class="flex-1"></span>
                        <span class="text-zinc-500 dark:text-zinc-400"><Icon icon=TablerIcon::TbLinkOutline width="1.25rem" height="1.25rem" /></span>
                    </A>
                </div>
                <div class="my-1"></div>
                <div class="flex flex-col w-full rounded-xl bg-zinc-300/75 dark:bg-zinc-600/75 overflow-hidden">
                    <button
                        class="flex items-center px-4 py-2.5 border-b border-zinc-500/50 dark:border-zinc-400/50 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition cursor-pointer"
                        on:click=move |_| set_curr_panel(Panel::Settings)
                    >
                        <span class="mr-1"><Icon icon=TablerIcon::TbSettingsOutline width="1.25rem" height="1.25rem" /></span>
                        <span class="relative text-sm">"Settings"</span>
                        <span class="flex-1"></span>
                        <span class="text-zinc-500 dark:text-zinc-400"><Icon icon=TablerIcon::TbChevronRightOutline width="1.25rem" height="1.25rem" /></span>
                    </button>
                    <button
                        class="flex items-center px-4 py-2.5 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition cursor-pointer"
                        on:click=move |_| set_curr_panel(Panel::LogOut)
                    >
                        <span class="mr-1"><Icon icon=TablerIcon::TbLogout2Outline width="1.25rem" height="1.25rem" /></span>
                        <span class="relative text-sm">"Log Out"</span>
                        <span class="flex-1"></span>
                        <span class="text-zinc-500 dark:text-zinc-400"><Icon icon=TablerIcon::TbChevronRightOutline width="1.25rem" height="1.25rem" /></span>
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn SettingsPanel(set_curr_panel: WriteSignal<Panel>) -> impl IntoView {
    view! {
        <div class="flex flex-col items-center justify-center w-full p-4">
            <div class="flex items-center">
                <AppButton
                    id="back-button"
                    title="Back"
                    on:click=move |_| set_curr_panel(Panel::Main)
                >
                    <span class="button-icon"><Icon icon=TablerIcon::TbChevronLeftOutline /></span>
                    <span class="button-text">"Back"</span>
                </AppButton>
                <span class="flex-1"></span>
            </div>
        </div>
    }
}

#[component]
pub fn LogOutPanel(set_curr_panel: WriteSignal<Panel>) -> impl IntoView {
    view! {
        <div class="flex flex-col items-center justify-center w-full p-4">
            <div class="flex items-center">
                <AppButton
                    id="back-button"
                    title="Back"
                    on:click=move |_| set_curr_panel(Panel::Main)
                >
                    <span class="button-icon"><Icon icon=TablerIcon::TbChevronLeftOutline /></span>
                    <span class="button-text">"Back"</span>
                </AppButton>
                <span class="flex-1"></span>
            </div>
        </div>
    }
}
