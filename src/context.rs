use crate::database::models::{
    profiles::ProfileObject,
    util::{
        filters::RatingFilter,
        themes::{Brightness, Theme},
    },
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, Eq, PartialEq)]
pub struct AppContext {
    pub theme: Theme,
    pub brightness: Brightness,
    pub age_check: bool,
    pub unblur_blogs: bool,
    pub rating_filter: RatingFilter,
}

impl Default for AppContext {
    fn default() -> Self {
        AppContext {
            theme: Theme::Crimson,
            brightness: Brightness::System,
            age_check: false,
            unblur_blogs: false,
            rating_filter: RatingFilter::Restricted,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AuthContext {
    pub account_id: Option<Uuid>,
    pub all_profiles: Vec<ProfileObject>,
    pub active_profile: Option<ProfileObject>,
}
