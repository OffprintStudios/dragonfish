use leptos::prelude::*;

#[component]
pub fn LinkBlock(
    #[prop(into)] id: String,
    #[prop(into)] title: String,
    #[prop(into)] href: String,
    #[prop(default = false)] primary: bool,
    #[prop(default = false)] disabled: bool,
    #[prop(default = false)] full_width: bool,
    children: Children,
) -> impl IntoView {
    view! {
        <a
            id=id
            title=title
            href=href
            class="btn"
            class:primary=primary
            class:w-full=full_width
            aria_disabled=disabled
        >
            {children()}
        </a>
    }
}
