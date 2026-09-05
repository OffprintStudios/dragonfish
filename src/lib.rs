pub mod app;
#[cfg(feature = "ssr")]
pub mod constants;
pub mod context;
pub mod database;
pub mod errors;
pub mod pages;
#[cfg(feature = "ssr")]
pub mod queues;
#[cfg(feature = "ssr")]
pub mod state;
pub mod ui;
pub mod util;

#[cfg(feature = "hydrate")]
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn hydrate() {
    use crate::app::*;
    console_error_panic_hook::set_once();
    leptos::mount::hydrate_body(App);
}
