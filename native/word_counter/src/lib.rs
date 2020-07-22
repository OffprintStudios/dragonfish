//! A native module for counting the number of words in the body of work submitted to Offprint.
//! Defines a single `count_words()` function, which is exposed via NodeJS's NAPI to NodeJS consumers
//! as `countWords(string)`.

#![forbid(unsafe_code)]

use std::error;

use napi::{CallContext, JsNumber, JsString, Error, Module, Result, register_module};
use napi_derive::js_function;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use voca_rs::count;

// Register's the module with the NodeJS runtime. The first argument should be the
// the name of the module (as produced by compiling it), with the second argument
// being an init function.
register_module!(word_counter, init);

/// The init function that must be passed to `register_module!()`. It must use the following
/// signature, and return Ok() on completion.
fn init(module: &mut Module) -> Result<()> {
    module.create_named_method("countWords", count_words)?;
    Ok(())
}

// #[js_function(1)] indicates that this is a function to be exposed to Javascript that accepts 1 argument.
#[js_function(1)]
fn count_words(context: CallContext) -> Result<JsNumber> {
    let js_string = context.get::<JsString>(0)?;
    let json_string = js_string.as_str()?;
    match try_count_words(json_string) {
        Ok(count) => context.env.create_uint32(count),
        Err(e) => Err(Error::from_reason(e.to_string()))
    }
}

#[inline]
fn try_count_words(json_string: &str) -> MultiResult<u32> {
    let work_content: Delta = serde_json::from_str(json_string)?;
    let all_text = work_content
        .ops
        .iter()
        .filter(|x| x.insert.is_string())
        .map(|x| x.insert.as_str().unwrap())
        .collect::<String>();
    let word_count = count::count_words(&all_text, "");
    Ok(word_count as u32)
}

// Alias Result<T> to dynamically-determined Result<T, (something)>, so we can wrap up all possible result types.
type MultiResult<T> = std::result::Result<T, Box<dyn error::Error>>;

/// Represents a QuillJS delta object.
#[derive(Serialize, Deserialize)]
pub struct Delta {
    ops: Vec<DeltaOps>,
}

/// Represents the series of changes contained within a QuillJS delta.
/// Note that Value is of type serde_json::Value.
#[derive(Serialize, Deserialize)]
pub struct DeltaOps {
    attributes: Option<Value>,
    insert: Value,
}