use serde::{Deserialize, Serialize};
use std::fmt::Formatter;
use strum::EnumIter;

#[derive(Debug, Copy, Clone, Serialize, Deserialize, Eq, PartialEq, Hash, EnumIter)]
pub enum Brightness {
    Light,
    Dark,
    System,
}

#[derive(Debug, Copy, Clone, Serialize, Deserialize, Eq, PartialEq, Hash, EnumIter)]
pub enum Theme {
    Crimson,
    Aqua,
    Royal,
    Autumn,
    Field,
}

impl Theme {
    pub fn accent_color(&self) -> String {
        match self {
            Theme::Crimson => "205, 86, 84".to_string(),
            Theme::Aqua => "98, 150, 209".to_string(),
            Theme::Royal => "145, 82, 169".to_string(),
            Theme::Autumn => "204, 118, 60".to_string(),
            Theme::Field => "79, 126, 53".to_string(),
        }
    }
}

impl std::fmt::Display for Brightness {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Brightness::Light => write!(f, "light"),
            Brightness::Dark => write!(f, "dark"),
            Brightness::System => write!(f, ""),
        }
    }
}

impl From<Theme> for String {
    fn from(value: Theme) -> Self {
        match value {
            Theme::Crimson => String::from("crimson"),
            Theme::Aqua => String::from("aqua"),
            Theme::Royal => String::from("royal"),
            Theme::Autumn => String::from("autumn"),
            Theme::Field => String::from("field"),
        }
    }
}

impl std::fmt::Display for Theme {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Theme::Crimson => write!(f, "crimson"),
            Theme::Aqua => write!(f, "aqua"),
            Theme::Royal => write!(f, "royal"),
            Theme::Autumn => write!(f, "autumn"),
            Theme::Field => write!(f, "field"),
        }
    }
}
