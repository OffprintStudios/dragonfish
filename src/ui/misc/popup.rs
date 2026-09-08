use leptos::html::{Dialog, Div};
use leptos::prelude::*;
use leptos_router::hooks::use_location;
use leptos_use::on_click_outside;

#[component]
pub fn Popup(
    #[prop(into)] id: String,
    #[prop(into)] show: RwSignal<bool>,
    #[prop(default = false)] full_width: bool,
    children: Children,
) -> impl IntoView {
    let dialog_ref = NodeRef::<Dialog>::new();
    let container_ref = NodeRef::<Div>::new();
    let location = use_location();

    let _ = on_click_outside(container_ref, move |_| {
        let node = dialog_ref.get().expect("dialog_ref not loaded!");
        show.set(false);
        node.close();
    });

    Effect::new(move |_| {
        location.pathname.track();
        untrack(move || show.set(false));
    });

    Effect::new(move |_| {
        if let Some(dialog) = dialog_ref.get() {
            if show.get() {
                let _ = dialog.show_modal();
            } else {
                dialog.close();
            }
        }
    });

    view! {
        <dialog
            id=id
            class="fixed top-[50%] left-[50%] backdrop:bg-zinc-900/50 backdrop:backdrop-blur-lg open:backdrop:animate-[modal-show_200ms_ease_normal] bg-transparent rounded-xl"
            class:w-full=full_width
            style="transform: translate(-50%, -50%);"
            on:close=move |_| show.set(false)
            node_ref=dialog_ref
        >
            <div
                class="m-8 bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur rounded-xl border border-zinc-600/25 dark:border-zinc-300/25 overflow-hidden motion-scale-in-50 motion-duration-350 motion-ease-spring-smooth"
                style="color: var(--text-color); box-shadow: var(--dropshadow);"
                node_ref=container_ref
            >
                {children()}
            </div>
        </dialog>
    }
}
