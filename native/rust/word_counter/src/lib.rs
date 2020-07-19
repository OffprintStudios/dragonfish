extern crate libc;

use std::error;

use libc::c_char;
use std::ffi::CStr;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use voca_rs::count;

// Alias Result<T> to dynamically-determined Result<T, (something)>, so we can wrap up all possible result types.
type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

#[derive(Serialize, Deserialize)]
pub struct Delta {
    ops: Vec<DeltaOps>,
}

#[derive(Serialize, Deserialize)]
pub struct DeltaOps {
    attributes: Option<Value>,
    insert: Value,
}

#[no_mangle]
pub extern "C" fn count_words(work_content: *const c_char, ) -> u32 {
    let c_str = unsafe { CStr::from_ptr(work_content) };
    match try_count_words(c_str) {
        Ok(count) => count,
        Err(_e) => 0 // todo: Error messaging?
    }
}

fn try_count_words(c_str: &CStr) -> Result<u32> {
    let rust_str = c_str.to_str()?;
    let work_content: Delta = serde_json::from_str(rust_str)?;
    let all_text = work_content
        .ops
        .iter()
        .filter(|x| x.insert.is_string())
        .map(|x| x.insert.as_str().unwrap())
        .collect::<String>();
    let word_count = count::count_words(&all_text, "");
    Ok(word_count as u32)
}
