use leptos::prelude::*;
use leptos::server_fn::codec::GetUrl;

use crate::{app::AppResult, database::models::profiles::ProfileObject};

#[server(GetBlogs, prefix = "/api/profile", endpoint = "blogs", input = GetUrl)]
pub async fn get_blogs() -> AppResult<()> {
    todo!()
}

#[component]
pub fn ProfileBlogsPage() -> impl IntoView {
    let _profile = use_context::<ReadSignal<ProfileObject>>().expect("No profile found!");

    view! {
        <div class="empty">
            <h3>"Nothing To See Here"</h3>
            <p>"This page is still under construction!"</p>
        </div>
    }
}
