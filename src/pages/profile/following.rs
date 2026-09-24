use leptos::prelude::*;

use crate::database::models::profiles::ProfileObject;

#[component]
pub fn ProfileFollowingPage() -> impl IntoView {
    let _profile = use_context::<ReadSignal<ProfileObject>>().expect("No profile found!");

    view! {
        <div class="empty">
            <h3>"Nothing To See Here"</h3>
            <p>"This page is still under construction!"</p>
        </div>
    }
}
