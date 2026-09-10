use crate::context::{AppContext, AuthContext};
use crate::database::models::util::themes::Brightness;
use crate::errors::{AppError, ErrorTemplate};
use crate::pages::{search::SearchPage, BaseLayout, HomePage};
use codee::string::JsonSerdeCodec;
use leptos::prelude::*;
use leptos_meta::{provide_meta_context, Body, Link, Meta, MetaTags, Stylesheet, Title};
use leptos_router::{
    components::{ParentRoute, Route, Router, Routes},
    path,
};
use leptos_use::{storage::use_local_storage, use_preferred_dark};

/// The result of any possible server function
pub type AppResult<T> = Result<T, AppError>;

pub fn shell(options: LeptosOptions) -> impl IntoView {
    view! {
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
                <AutoReload options=options.clone() />
                <HydrationScripts options/>
                <MetaTags/>
            </head>
            <body>
                <App/>
            </body>
        </html>
    }
}

#[server(GetAuthContext)]
async fn get_auth_context() -> AppResult<AuthContext> {
    use crate::database::models::accounts::Session;

    Session::get_auth_context().await
}

#[component]
pub fn App() -> impl IntoView {
    let (app, _, _) = use_local_storage::<AppContext, JsonSerdeCodec>("app");
    let is_preferred_dark = use_preferred_dark();

    let (refetch, set_refetch) = signal(());
    let auth_context = Resource::new_blocking(move || refetch.get(), |_| get_auth_context());
    provide_context(set_refetch);

    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    view! {
        // injects a stylesheet into the document <head>
        // id=leptos means cargo-leptos will hot-reload this stylesheet
        <Stylesheet id="leptos" href="/pkg/dragonfish.css"/>

        // sets the app favicon
        <Link rel="shortcut icon" type_="image/png" href="/favicon.png" />
        <Link rel="apple-touch-icon" type_="image/png" href="/images/offprint-icon.png" />

        // sets the theme color (Chrome, Firefox, Orion, etc)
        <Meta name="theme-color" content=move || format!("rgb({})", app().theme.accent_color()) />

        // sets the document title
        <Title text="Offprint"/>

        // determines which theme and brightness classes to use based on
        // per-browser settings and dark mode preferences
        <Body attr:style=move || format!("background-color: rgb({})", app().theme.accent_color()) />

        // Dragonfish router tree
        <Router>
            <Suspense fallback=move || view! { <p>"Loading..."</p> }>
                {move || {
                    auth_context.get().map(|result| {
                        match result {
                            Ok(context) => {
                                provide_context(context);

                                view! {
                                    <main
                                        class=move || {
                                            let theme = app().theme;
                                            if app().brightness == Brightness::System {
                                                match is_preferred_dark() {
                                                    true => format!("{} {}", Brightness::Dark, theme),
                                                    false => format!("{} {}", Brightness::Light, theme),
                                                }
                                            } else {
                                                format!("{} {}", app().brightness, theme)
                                            }
                                        }
                                    >
                                        <Routes
                                            transition=true
                                            fallback=|| {
                                                let mut errors = Errors::default();
                                                errors.insert_with_default_key(AppError::NotFound);
                                                view! {
                                                    <ErrorTemplate errors />
                                                }.into_view()
                                            }
                                        >
                                            <ParentRoute path=path!("/") view=BaseLayout>
                                                <Route path=path!("search") view=SearchPage />
                                                <Route path=path!("") view=HomePage />
                                            </ParentRoute>
                                        </Routes>
                                    </main>
                                }.into_any()
                            },
                            Err(_) => view! { <p>"Error loading authentication!"</p> }.into_any()
                        }
                    })
                }}
            </Suspense>
        </Router>
    }
}
