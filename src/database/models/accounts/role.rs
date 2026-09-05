use serde::{Deserialize, Serialize};
use strum::Display;

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Display, Serialize, Deserialize, Hash,
)]
#[cfg_attr(feature = "ssr", derive(sqlx::Type))]
pub enum Role {
    Admin,
    Moderator,
    ChatModerator,
    WorkApprover,
    Contributor,
    User,
}

impl Role {
    /// Translates enum item into its respective, *themed* counterpart
    pub fn into_themed(&self) -> String {
        match self {
            Role::Admin => "Manager",
            Role::Moderator => "Barista",
            Role::ChatModerator => "Attendant",
            Role::WorkApprover => "Quality Control",
            Role::Contributor => "Comrade",
            Role::User => "Patron",
        }
        .into()
    }
}

impl From<String> for Role {
    fn from(value: String) -> Self {
        match value.as_str() {
            "Admin" => Role::Admin,
            "Moderator" => Role::Moderator,
            "ChatModerator" => Role::ChatModerator,
            "WorkApprover" => Role::WorkApprover,
            "Contributor" => Role::Contributor,
            "User" => Role::User,
            _ => Role::User,
        }
    }
}
