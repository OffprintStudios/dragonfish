pub mod models;

#[cfg(feature = "ssr")]
pub async fn connect_to_db() -> sqlx::PgPool {
    let database_url = std::env::var("DATABASE_URL").expect(
        "Could not find DATABASE_URL! Are you sure the environment is configured correctly?",
    );

    sqlx::postgres::PgPoolOptions::new()
        .min_connections(1)
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect(
            "Could not connect to database! Are you sure the environment is configured correctly?",
        )
}
