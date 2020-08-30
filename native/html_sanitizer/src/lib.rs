use wasm_bindgen::prelude::*;
use ammonia::Builder;
use maplit::{hashset, hashmap};

/// Takes the given HTML string and removes anything not allowed.
/// Preserves inline styles on div, p, a, img, and h1-h6 tags.
/// ## Arguments
///
/// * `html_string` - A string containing HTML to be sanitized.
#[wasm_bindgen]
pub fn sanitize_html(html_string: &str) -> String {
  Builder::default()
    //Allow inline styles on <div>, <p>, <a>, <img>, and the <hX> tags
    .add_tag_attributes("div", &["style"])
    .add_tag_attributes("p", &["style"])
    .add_tag_attributes("a", &["style"])
    .add_tag_attributes("h1", &["style"])
    .add_tag_attributes("h2", &["style"])
    .add_tag_attributes("h3", &["style"])
    .add_tag_attributes("h4", &["style"])
    .add_tag_attributes("h5", &["style"])
    .add_tag_attributes("h6", &["style"])
    .add_tag_attributes("img", &["style"])
    .clean(html_string)
    .to_string()
}

/// Attempts to remove **all** HTML from the given string, and returns only
/// the text contained within.
/// ## Arguments
///
/// * `html_string` - A string containing the HTML to be sanitized.
#[wasm_bindgen]
pub fn strip_all_html(html_string: &str) -> String {
  Builder::default()
    .tags(hashset![])
    .generic_attributes(hashset![])
    .tag_attributes(hashmap![])
    .tag_attribute_values(hashmap![])
    .url_schemes(hashset![])
    .clean(html_string)
    .to_string()
}
