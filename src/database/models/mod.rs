//! `models`
//!
//! This module contains all database models and their associated functions. Some models
//! in here may only be used for server-side (SSR) purposes, while others can conditionally
//! be used client-side. Make sure to note the `#[cfg(feature = "ssr")]` flags to determine
//! use case.

pub mod accounts;
pub mod content;
pub mod profiles;
pub mod util;
