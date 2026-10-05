use serde::{Deserialize, Serialize};
use strum::Display;

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Display, Serialize, Deserialize, Hash,
)]
#[cfg_attr(feature = "ssr", derive(sqlx::Type))]
pub enum ContentLicense {
    /// CC BY (Attribution): Only requires you to credit the creator. Allows commercial use, distribution, and remixing.
    CCBY,
    /// CC BY-SA (Attribution-ShareAlike): Requires credit and same license on adaptations. Allows commercial use and remixing, but forces modified versions to stay open under the same terms.
    CCBYSA,
    /// CC BY-NC (Attribution-NonCommercial): Requires credit and non-profit use. Allows remixing and building upon the work, but not for commercial profit.
    CCBYNC,
    /// CC BY-NC-SA (Attribution-NonCommercial-ShareAlike): Requires credit, non-profit use, and identical terms on remixes. Allows sharing and adaptation for non-commercial purposes only.
    CCBYNCSA,
    /// CC BY-ND (Attribution-NoDerivs): Requires credit and no changes to the work. Allows commercial use and sharing, but you cannot alter or adapt the material.
    CCBYND,
    /// CC BY-NC-ND (Attribution-NonCommercial-NoDerivs): Requires credit, non-profit use, and unadapted distribution. Allows only sharing of the original work without commercial intent and without modification.
    CCBYNCND,
    /// CC0 (Public Domain): Waves all rights to commercialisation, modification, and attribution.
    CC0,
}
