use leptos::prelude::*;
use leptos_meta::*;

#[component]
pub fn MetaTags(
    #[prop(into)] url: Signal<String>,
    #[prop(into)] title: Signal<String>,
    #[prop(into, optional)] author_url: Option<Signal<String>>,
    #[prop(into)] description: Signal<String>,
    #[prop(into)] image_url: Signal<String>,
) -> impl IntoView {
    view! {
        <Title text=title() />

        <Meta name="title" content=title() />
        <Meta name="description" content=description() />

        // Open Graph / Facebook
        <Meta property="og:type" content="website" />
        <Meta property="og:url" content=url() />
        <Meta property="og:title" content=title() />
        {if let Some(author_url) = author_url {
            view! {
                <Meta property="book:author" content=author_url() />
            }
        } else {
            view! {
                <Meta property="book:author" content="" />
            }
        }}
        <Meta property="og:description" content=description() />
        <Meta property="og:image" content=image_url() />

        // Twitter
        <Meta property="twitter:card" content="summary" />
        <Meta property="twitter:url" content=url() />
        <Meta property="twitter:title" content=title() />
        <Meta property="twitter:description" content=description() />
        <Meta property="twitter:image" content=image_url() />
    }
}
