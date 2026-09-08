use leptos::ev::MouseEvent;
use leptos::prelude::*;

#[component]
pub fn Switch(
    #[prop(optional, into)] value: RwSignal<bool>,
    #[prop(optional, into)] on_change: Option<Callback<bool>>,
) -> impl IntoView {
    let on_click = move |_: MouseEvent| {
        let new_value = !value.get_untracked();
        value.set(new_value);
        if let Some(on_change) = on_change {
            on_change.run(new_value);
        }
    };

    view! {
        <div
            class="switch"
            class:active=value
            on:click=on_click
            role="switch"
            aria-checked=move || if value.get() { "true" } else { "false" }
        >
            <div class="switch-button" />
        </div>
    }
}
