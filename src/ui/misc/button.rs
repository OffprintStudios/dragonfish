use leptos::either::Either;
use leptos::prelude::*;
use leptos_icons::*;

pub enum ButtonType {
    Default,
    Submit,
    Reset,
}

#[component]
pub fn Button(
    #[prop(into)] id: String,
    #[prop(into)] title: String,
    #[prop(default = ButtonType::Default)] type_of: ButtonType,
    #[prop(default = false)] primary: bool,
    #[prop(default = false)] active: bool,
    #[prop(default = false)] loading: bool,
    #[prop(into, default = String::from(""))] loading_text: String,
    #[prop(default = false)] disabled: bool,
    #[prop(default = false)] full_width: bool,
    children: Children,
) -> impl IntoView {
    let type_of_button = match type_of {
        ButtonType::Default => "button",
        ButtonType::Submit => "submit",
        ButtonType::Reset => "reset",
    };

    view! {
        <button
            id=id
            title=title
            type=type_of_button
            class="btn"
            class:primary=primary
            class:active=active
            class:w-full=full_width
            disabled=move || { disabled || loading }
        >
            {if loading {
                Either::Left(
                    view! {
                        <span class="button-icon animate-spin"><Icon icon=icondata::TbLoader2Outline /></span>
                        <span class="button-text">{loading_text}</span>
                    }
                )
            } else {
                Either::Right(children())
            }}
        </button>
    }
}
