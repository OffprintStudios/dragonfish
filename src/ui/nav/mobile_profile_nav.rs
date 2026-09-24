use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;

use crate::database::models::profiles::ProfileObject;
use crate::ui::misc::{Button, LinkBlock};

#[component]
pub fn MobileProfileNav(
    #[prop(into)] profile: ReadSignal<ProfileObject>,
    #[prop(into)] is_author: ReadSignal<bool>,
) -> impl IntoView {
    view! {
        <div class="flex items-end relative z-10 px-4 md:hidden bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg max-h-[62.5px]">
            <div class="w-[125px] h-[125px] rounded-full overflow-hidden border-4 border-zinc-300 dark:border-zinc-600">
                <img src=move || profile().avatar class="w-full h-full object-cover" alt=move || format!("{}'s avatar", profile().username) />
            </div>
            <div class="flex-1"></div>
            <div class="flex items-center bg-zinc-200 dark:bg-zinc-600 p-1 rounded-xl">
                <Show
                    when=move || is_author()
                    fallback=move || view! {
                        <Button
                            id="follow-profile-button"
                            title="Follow"
                        >
                            <span class="button-icon no-text"><Icon icon=TablerIcon::TbUserHeartOutline width="18px" height="18px" /></span>
                        </Button>
                        <div class="mx-0.5"></div>
                        <Button
                            id="more-options-button"
                            title="More Options"
                        >
                            <span class="button-icon no-text"><Icon icon=TablerIcon::TbDotsVerticalOutline width="18px" height="18px" /></span>
                        </Button>
                    }
                >
                    <LinkBlock
                        id="profile-settings-button"
                        title="Profile Settings"
                        href=move || format!("/profile/{}/{}/settings", profile().id, slug::slugify(profile().username))
                    >
                        <span class="button-icon no-text"><Icon icon=TablerIcon::TbSettingsOutline width="18px" height="18px" /></span>
                    </LinkBlock>
                </Show>
            </div>
        </div>
    }
}
