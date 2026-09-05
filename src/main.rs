#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    use apalis::prelude::*;
    use axum::{Extension, Router};
    use dragonfish::{app::*, constants, database, state};
    use leptos::logging::log;
    use leptos::prelude::*;
    use leptos_axum::{generate_route_list, LeptosRoutes};

    dotenvy::dotenv().ok();

    let conf = get_configuration(None).unwrap();
    let addr = conf.leptos_options.site_addr;
    let leptos_options = conf.leptos_options;
    // Generate the list of routes in your Leptos App
    let routes = generate_route_list(App);

    let db = database::connect_to_db().await;

    // Set secret key for private cookies
    let secret_key = std::env::var("SECRET_KEY").expect(
        "Could not find SECRET_KEY! Check to see if your environment is configured correctly.",
    );
    constants::SECRET_KEY
        .set(tower_cookies::Key::from(secret_key.as_bytes()))
        .ok();

    // Create job queue RedisStorage
    let redis_url = std::env::var("REDIS_URL").expect(
        "Could not find REDIS_URL! Check to see if your environment is configured correctly.",
    );
    let queue_conn = apalis_redis::connect(redis_url).await.expect(
        "Could not connect to Redis! Check to see if your environment is configured correctly.",
    );
    let storage = apalis_redis::RedisStorage::new(queue_conn);

    // Create state object
    let app_state = state::AppState {
        db: db.clone(),
        leptos_options,
    };

    let app = Router::new()
        .leptos_routes_with_context(
            &app_state,
            routes,
            {
                let state = app_state.clone();
                move || provide_context(state.clone())
            },
            {
                let leptos_options = app_state.leptos_options.clone();
                move || shell(leptos_options.clone())
            },
        )
        .fallback(leptos_axum::file_and_error_handler_with_context::<
            state::AppState,
            _,
        >(
            {
                let state = app_state.clone();
                move || provide_context(state.clone())
            },
            shell,
        ))
        .with_state(app_state.clone())
        .layer(tower_cookies::CookieManagerLayer::new())
        .layer(Extension(storage.clone()));

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    log!("listening on http://{}", &addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    let http = async {
        axum::serve(listener, app.into_make_service())
            .await
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::Interrupted, e))
    };

    let monitor = Monitor::new()
        .register(move |_| {
            use dragonfish::queues;

            WorkerBuilder::new("app-mailer")
                .backend(storage.clone())
                .concurrency(2)
                .parallelize(tokio::spawn)
                .enable_tracing()
                .build(queues::email::send_email)
        })
        .run();

    _ = tokio::join!(http, monitor);
    Ok(())
}

#[cfg(not(feature = "ssr"))]
pub fn main() {
    // no client-side main function
    // unless we want this to work with e.g., Trunk for pure client-side testing
    // see lib.rs for hydration function instead
}
