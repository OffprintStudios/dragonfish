use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum RatingFilter {
    Restricted,
    MatureOnly,
    ExplicitOnly,
    Everything,
}
