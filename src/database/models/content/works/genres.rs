use serde::{Deserialize, Serialize};
use strum::{Display, EnumIter};

#[derive(
    Debug,
    Clone,
    Copy,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    Display,
    EnumIter,
    Hash,
    Serialize,
    Deserialize,
)]
#[cfg_attr(feature = "ssr", derive(sqlx::Type))]
pub enum Genre {
    ActionAdventure,
    Comedy,
    Drama,
    Erotica,
    Fantasy,
    Horror,
    Mystery,
    Romance,
    ScienceFiction,
    SliceOfLife,
    SpeculativeFiction,
    Thriller,
    Tragedy,
}

impl Genre {
    pub fn to_themed(self) -> String {
        match self {
            Genre::ActionAdventure => "Action/Adventure",
            Genre::Comedy => "Comedy",
            Genre::Drama => "Drama",
            Genre::Erotica => "Erotica",
            Genre::Fantasy => "Fantasy",
            Genre::Horror => "Horror",
            Genre::Mystery => "Mystery",
            Genre::Romance => "Romance",
            Genre::ScienceFiction => "Science Fiction",
            Genre::SliceOfLife => "Slice of Life",
            Genre::SpeculativeFiction => "Speculative Fiction",
            Genre::Thriller => "Thriller",
            Genre::Tragedy => "Tragedy",
        }
        .into()
    }

    pub fn to_icon(self) -> icondata::Icon {
        match self {
            Genre::ActionAdventure => icondata::TbSwordsOutline,
            Genre::Comedy => icondata::TbMoodTongueWinkOutline,
            Genre::Drama => icondata::TbMasksTheaterOutline,
            Genre::Erotica => icondata::TbDoorOutline,
            Genre::Fantasy => icondata::TbWandOutline,
            Genre::Horror => icondata::TbHazeMoonOutline,
            Genre::Mystery => icondata::TbBrandRedhatOutline,
            Genre::Romance => icondata::TbHeartsOutline,
            Genre::ScienceFiction => icondata::TbUfoOutline,
            Genre::SliceOfLife => icondata::TbHomeOutline,
            Genre::SpeculativeFiction => icondata::TbMeteorOutline,
            Genre::Thriller => icondata::TbSpyOutline,
            Genre::Tragedy => icondata::TbSkullOutline,
        }
    }
}

impl From<String> for Genre {
    fn from(value: String) -> Self {
        match value.as_str() {
            "ActionAdventure" => Genre::ActionAdventure,
            "Comedy" => Genre::Comedy,
            "Drama" => Genre::Drama,
            "Erotica" => Genre::Erotica,
            "Fantasy" => Genre::Fantasy,
            "Horror" => Genre::Horror,
            "Mystery" => Genre::Mystery,
            "Romance" => Genre::Romance,
            "ScienceFiction" => Genre::ScienceFiction,
            "SliceOfLife" => Genre::SliceOfLife,
            "SpeculativeFiction" => Genre::SpeculativeFiction,
            "Thriller" => Genre::Thriller,
            "Tragedy" => Genre::Tragedy,
            _ => Genre::ActionAdventure,
        }
    }
}
