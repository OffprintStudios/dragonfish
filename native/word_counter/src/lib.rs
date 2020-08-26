//! A native module for counting the number of words in the body of work submitted to Offprint.
//! Defines a single `count_words()` function.

use wasm_bindgen::prelude::*;

use serde::{Deserialize, Serialize};
use serde_json::{Value};
use voca_rs::count;

#[derive(Serialize, Deserialize, Debug)]
pub struct Delta {
    ops: Vec<DeltaOps>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DeltaOps {
    attributes: Option<Value>,
    insert: Value
}

#[wasm_bindgen]
pub fn count_words(body_text: &str) -> Result<u32, JsValue> {
    match try_count_words(&body_text) {
        Ok(count) => Ok(count),
        Err(e) => Err(js_sys::Error::new(&e.to_string()).into())
    }
}

fn try_count_words(text: &str) -> serde_json::Result<u32> {
    let work_content: Delta = serde_json::from_str(text)?;
    let all_text = work_content
        .ops
        .iter()
        .filter(|x| x.insert.is_string())
        .map(|x| x.insert.as_str().unwrap())
        .collect::<String>();
    let word_count = count::count_words(&all_text, "");
    Ok(word_count as u32)
}
