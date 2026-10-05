use serde::{Deserialize, Serialize};
use strum::Display;

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Display, Serialize, Deserialize, Hash,
)]
#[cfg_attr(feature = "ssr", derive(sqlx::Type))]
pub enum WorkKind {
    Prose,
    Poetry,
    Script,
    Anthology,
}
