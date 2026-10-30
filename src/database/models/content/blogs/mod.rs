mod blog;
#[cfg(feature = "ssr")]
mod blog_tag;
#[cfg(feature = "ssr")]
mod blog_vote;

#[cfg(feature = "ssr")]
pub use blog::Blog;
pub use blog::BlogObject;
#[cfg(feature = "ssr")]
pub use blog_tag::BlogTag;
#[cfg(feature = "ssr")]
pub use blog_vote::{BlogVote, BlogVoteStatus};
