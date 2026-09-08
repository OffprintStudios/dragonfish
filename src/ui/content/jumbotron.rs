use leptos::prelude::*;

#[component]
pub fn Jumbotron() -> impl IntoView {
    view! {
        <div class="relative w-full md:w-11/12 mx-auto md:rounded-4xl overflow-hidden h-64 md:h-112" style="box-shadow: var(--dropshadow);">
            <img src="https://images.offprint.net/blog-banners/gi03BYkC8o-4A0938CB-1399-49D4-AC57-AAB60A187DC3.jpeg" class="object-cover w-full h-full" />
            <div
                class="absolute bottom-0 pt-4 pb-2 flex flex-col items-center w-full bg-linear-to-b from-transparent to-black"
            >
                <h1 class="text-xl md:text-4xl text-white!">"The Brightest Star in the Night Sky"</h1>
                <span class="text-lg md:text-2xl text-zinc-400 italic font-header">"The One About The Future"</span>
                <div class="flex items-center justify-center">
                    <span class="text-xl mx-0.5 text-white">"•"</span>
                    <span class="text-xl mx-0.5 text-zinc-400">"•"</span>
                    <span class="text-xl mx-0.5 text-zinc-400">"•"</span>
                    <span class="text-xl mx-0.5 text-zinc-400">"•"</span>
                    <span class="text-xl mx-0.5 text-zinc-400">"•"</span>
                </div>
            </div>
        </div>
    }
}
