use leptos::prelude::*;

#[component]
pub fn TextArea(
    #[prop(into)] name: String,
    #[prop(into)] label: String,
    #[prop(into, default = String::from("Enter text here"))] placeholder: String,
    #[prop(into, optional)] hint: Option<String>,
    #[prop(into, optional)] error_msg: Option<String>,
    #[prop(default = false)] required: bool,
) -> impl IntoView {
    let show_err = error_msg.unwrap_or_default();
    let show_hint = hint.unwrap_or_default();

    view! {
        <div>
            <label for=name.clone() class="flex items-center all-small-caps font-bold tracking-wide relative left-2 select-none">
                {label}<span class="text-red-600 text-xl relative top-0.5 ml-1">{if required { "*" } else { "" }}</span>
                <span class="flex-1" />
                <span class="italic text-zinc-500 dark:text-zinc-400 relative right-4">{show_hint}</span>
            </label>
            <textarea
                id=name.clone()
                name=name.clone()
                placeholder=placeholder
                required=required
                class="transition w-full h-[100px] rounded-xl border-2 border-x-transparent border-t-transparent focus:border-x-transparent focus:border-t-transparent focus:ring-0 border-zinc-400 dark:border-b-zinc-500 bg-zinc-300/50 dark:bg-zinc-600/50 backdrop-blur-lg focus:border-b-accent dark:focus:border-b-accent"
            />
            <div class="flex pt-1">
                <span class="flex-1"></span>
                <span class="w-full text-right text-red-600 text-xs relative mr-2">{show_err}</span>
            </div>
        </div>
    }
}
