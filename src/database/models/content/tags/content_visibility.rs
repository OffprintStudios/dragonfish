use serde::{Deserialize, Serialize};
use strum::Display;

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Display, Serialize, Deserialize, Hash,
)]
#[cfg_attr(feature = "ssr", derive(sqlx::Type))]
#[cfg_attr(feature = "ssr", sqlx(type_name = "content_visibility"))]
pub enum ContentVisibility {
    Private,
    Profile,
    Public,
}

impl From<String> for ContentVisibility {
    fn from(value: String) -> Self {
        match value.as_str() {
            "Private" => ContentVisibility::Private,
            "Profile" => ContentVisibility::Profile,
            "Public" => ContentVisibility::Public,
            _ => ContentVisibility::Private,
        }
    }
}
