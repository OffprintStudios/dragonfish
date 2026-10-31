use codee::string::JsonSerdeCodec;
use icondata as TablerIcon;
use leptos::prelude::*;
use leptos::server_fn::codec::GetUrl;
use leptos_icons::*;
use leptos_use_storage::{use_local_storage_with_options, UseStorageOptions};

use crate::context::AuthContext;
use crate::ui::misc::{Button, Popup};
use crate::{app::AppResult, database::models::profiles::ProfileObject};

#[server(GetBlogs, prefix = "/api/profile", endpoint = "blogs", input = GetUrl)]
pub async fn get_blogs() -> AppResult<()> {
    todo!()
}

#[server(AddBlog, prefix = "/api/profile/blogs", endpoint = "new")]
pub async fn add_blog() -> AppResult<()> {
    todo!()
}

#[component]
pub fn ProfileBlogsPage() -> impl IntoView {
    let profile = use_context::<ReadSignal<ProfileObject>>().expect("No profile found!");
    let (auth, _, _) = use_local_storage_with_options::<AuthContext, JsonSerdeCodec>(
        "auth",
        UseStorageOptions::default().delay_during_hydration(true),
    );
    let add_menu = RwSignal::new(false);

    let submit = ServerAction::<AddBlog>::new();
    let value = submit.value();
    let has_error = move || value.with(|val| matches!(val, Some(Err(_))));
    // let error = move || {
    //     value.with(|val| {
    //         let some = val.to_owned();
    //         match some {
    //             Some(v) => match v {
    //                 Ok(()) => LogInError::ServerError.to_string(),
    //                 Err(e) => e.to_string(),
    //             },
    //             None => LogInError::ServerError.to_string(),
    //         }
    //     })
    // };

    view! {
        <div
            class="flex items-center justify-center w-full p-2 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg md:rounded-b-xl border-b border-t-0 md:border-t-1 border-x-0 md:border-x-1 border-zinc-600/25 dark:border-zinc-300/25 transition"
            style="box-shadow: var(--dropshadow)"
        >
            <Show
                when=move || auth().active_profile.is_some_and(|p| p.id == profile().id)
            >
                <Button
                    id="add-new"
                    title="Add New Blog"
                    primary=true
                    on:click=move |_| add_menu.set(true)
                >
                    <span class="button-icon"><Icon icon=TablerIcon::TbNewSectionOutline width="1.125rem" height="1.125rem" /></span>
                    <span class="button-text">"Add"</span>
                </Button>
                <Popup
                    id="add-menu"
                    show=add_menu
                >
                    <ActionForm action=submit>
                        "hi"
                    </ActionForm>
                </Popup>
                <span class="mx-2 relative -top-0.5 text-4xl font-extralight text-zinc-300 dark:text-zinc-600">"|"</span>
            </Show>
            <Button
                id="card-view"
                title="Card View"
            >
                <span class="button-icon no-text py-[0.075rem]!"><Icon icon=TablerIcon::TbCardsOutline width="1.125rem" height="1.125rem" /></span>
            </Button>
            <span class="mx-0.5"></span>
            <Button
                id="list-view"
                title="List View"
                active=true
            >
                <span class="button-icon no-text py-[0.075rem]!"><Icon icon=TablerIcon::TbListDetailsOutline width="1.125rem" height="1.125rem" /></span>
            </Button>
            <div class="flex-1"></div>
        </div>

        <div class="empty">
            <h3>"Nothing To See Here"</h3>
            <p>"This page is still under construction!"</p>
        </div>
    }
}
