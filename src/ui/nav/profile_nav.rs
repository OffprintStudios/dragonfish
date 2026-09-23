use leptos::prelude::*;

use crate::database::models::profiles::ProfileObject;

#[component]
pub fn ProfileNav(
    #[prop(into)] _profile: ReadSignal<ProfileObject>,
    #[prop(into)] _is_author: ReadSignal<bool>,
    children: Children,
) -> impl IntoView {
    view! {
        <span>"todo"</span>
        <div>{children()}</div>
    }
}
