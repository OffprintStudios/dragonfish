use leptos::prelude::*;

pub enum TextFieldType {
    Text,
    Email,
    Password,
}

#[component]
pub fn TextField(
    #[prop(into)] name: Signal<String>,
    #[prop(into)] label: Signal<String>,
    #[prop(default = TextFieldType::Text)] kind: TextFieldType,
    #[prop(into, default = String::from("Enter text here"))] placeholder: String,
    #[prop(into, optional)] hint: Option<String>,
    #[prop(into, optional)] error_msg: Option<String>,
    #[prop(into, default = String::from("off"))] autocomplete: String,
    #[prop(default = false)] required: bool,
    #[prop(default = true)] has_label: bool,
) -> impl IntoView {
    let show_hint = hint.unwrap_or_default();
    let show_err = error_msg.unwrap_or_default();

    let type_of = match kind {
        TextFieldType::Text => "text",
        TextFieldType::Email => "email",
        TextFieldType::Password => "password",
    };

    view! {
        <div>
            {if has_label {
                view! {
                    <label for=name() class="flex items-center all-small-caps font-semibold text-sm tracking-wide relative left-2 select-none">
                        {label()}<span class="text-red-600 text-xl relative top-1 ml-1">{if required { "*" } else { "" }}</span>
                        <span class="flex-1"></span>
                        <span class="italic text-zinc-500 dark:text-zinc-400 relative right-4">{show_hint}</span>
                    </label>
                }.into_any()
            } else {
                view! { <span class="hidden">"nothing"</span> }.into_any()
            }}
            <input
                id=name()
                name=name()
                type=type_of
                placeholder=placeholder
                autocomplete=autocomplete
                required=required
                class="transition w-full rounded-xl border-2 border-x-transparent border-t-transparent focus:border-x-transparent focus:border-t-transparent focus:ring-0 border-zinc-400 dark:border-b-zinc-500 bg-zinc-300/50 dark:bg-zinc-600/50 backdrop-blur-lg focus:border-b-accent dark:focus:border-b-accent cursor-text"
            />
            <div class="flex pt-1">
                <span class="flex-1"></span>
                <span class="w-full text-right text-red-600 text-xs relative mr-2">{show_err}</span>
            </div>
        </div>
    }
}
