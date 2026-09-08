use leptos::prelude::*;

#[component]
pub fn Editor(
    #[prop(into)] name: String,
    #[prop(into, default = String::from("Enter text here"))] placeholder: String,
    #[prop(default = false)] required: bool,
    #[prop(default = false)] match_background: bool,
) -> impl IntoView {
    view! {
        <div
            class="flex flex-col w-full h-full"
            class=("bg-transparent", match_background)
            class=(["bg-zinc-200", "dark:bg-zinc-700"], !match_background)
        >
            <div class="w-full flex items-center">
                <span>"toolbar"</span>
            </div>
            <textarea
                id=name.clone()
                name=name.clone()
                placeholder=placeholder
                required=required
                class="h-full bg-transparent border-0 focus-0 ring-0 resize-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
            ></textarea>
        </div>
    }
}
