use icondata as TablerIcon;
use leptos::prelude::*;
use leptos::server_fn::codec::GetUrl;
use leptos_icons::*;

use crate::ui::misc::Button;
use crate::{app::AppResult, database::models::profiles::ProfileObject};

#[server(GetBlogs, prefix = "/api/profile", endpoint = "blogs", input = GetUrl)]
pub async fn get_blogs() -> AppResult<()> {
    todo!()
}

#[component]
pub fn ProfileBlogsPage() -> impl IntoView {
    let _profile = use_context::<ReadSignal<ProfileObject>>().expect("No profile found!");

    view! {
        <div
            class="flex items-center justify-center w-full p-2 my-4 md:my-0 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg rounded-b-xl border border-t-0 border-zinc-600/25 dark:border-zinc-300/25 transition"
            style="box-shadow: var(--dropshadow)"
        >
            <Button
                id="add-new"
                title="Add New Blog"
                primary=true
            >
                <span class="button-icon"><Icon icon=TablerIcon::TbNewSectionOutline width="1.25rem" height="1.25rem" /></span>
                <span class="button-text">"Add"</span>
            </Button>
            <span class="mx-2 relative -top-1 text-4xl font-extralight text-zinc-300 dark:text-zinc-600">"|"</span>
            <Button
                id="list-view"
                title="List View"
                active=true
            >
                <span class="button-icon no-text py-0.5!"><Icon icon=TablerIcon::TbListDetailsOutline width="1.25rem" height="1.25rem" /></span>
            </Button>
            <Button
                id="card-view"
                title="Card View"
            >
                <span class="button-icon no-text py-0.5!"><Icon icon=TablerIcon::TbCardsOutline width="1.25rem" height="1.25rem" /></span>
            </Button>
            <div class="flex-1"></div>
        </div>

        <div class="empty">
            <h3>"Nothing To See Here"</h3>
            <p>"This page is still under construction!"</p>
        </div>
    }
}
