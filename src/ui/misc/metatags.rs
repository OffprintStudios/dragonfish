use leptos::prelude::*;
use leptos_meta::*;

#[component]
pub fn MetaTags(
    #[prop(into)] url: String,
    #[prop(into)] title: String,
    #[prop(into, optional)] author_url: Option<String>,
    #[prop(into)] description: String,
    #[prop(into)] image_url: String,
) -> impl IntoView {
    view! {
        <Title text=title.clone() />

        <Meta name="title" content=title.clone() />
        <Meta name="description" content=description.clone() />

        // Open Graph / Facebook
        <Meta property="og:type" content="website" />
        <Meta property="og:url" content=url.clone() />
        <Meta property="og:title" content=title.clone() />
        {if let Some(author_url) = author_url {
            view! {
                <Meta property="book:author" content=author_url.clone() />
            }
        } else {
            view! {
                <Meta property="book:author" content="" />
            }
        }}
        <Meta property="og:description" content=description.clone() />
        <Meta property="og:image" content=image_url.clone() />

        // Twitter
        <Meta property="twitter:card" content="summary" />
        <Meta property="twitter:url" content=url.clone() />
        <Meta property="twitter:title" content=title.clone() />
        <Meta property="twitter:description" content=description.clone() />
        <Meta property="twitter:image" content=image_url.clone() />
    }
}
