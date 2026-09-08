use crate::{database::models::accounts::Role, util::functions::get_prominent_role};
use leptos::prelude::*;

#[component]
pub fn RoleBadge(roles: Vec<Role>) -> impl IntoView {
    let role = get_prominent_role(roles);

    view! {
        <div
            class="role"
            class=("admin", role == Role::Admin)
            class=("moderator", role == Role::Moderator)
            class=("chat-moderator", role == Role::ChatModerator)
            class=("work-approver", role == Role::WorkApprover)
            class=("contributor", role == Role::Contributor)
            class=("user", role == Role::User)
            title=role.into_themed()
        >
            <span class="font-bold tracking-wider uppercase text-[0.625rem] mx-1 relative top-[0.075rem]">
                {role.into_themed()}
            </span>
        </div>
    }
}
