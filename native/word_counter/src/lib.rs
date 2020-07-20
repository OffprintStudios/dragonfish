use std::error;

use napi::{CallContext, JsNumber, JsString, Error, Module, Result, register_module};
use napi_derive::js_function;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use voca_rs::count;

// Alias Result<T> to dynamically-determined Result<T, (something)>, so we can wrap up all possible result types.
type MultiResult<T> = std::result::Result<T, Box<dyn error::Error>>;

#[derive(Serialize, Deserialize)]
pub struct Delta {
    ops: Vec<DeltaOps>,
}

#[derive(Serialize, Deserialize)]
pub struct DeltaOps {
    attributes: Option<Value>,
    insert: Value,
}

register_module!(word_counter, init);

fn init(module: &mut Module) -> Result<()> {
    module.create_named_method("countWords", count_words)?;
    Ok(())
}

#[js_function(1)]
fn count_words(context: CallContext) -> Result<JsNumber> {
    let js_string = context.get::<JsString>(0)?;
    let json_string = js_string.as_str()?;
    match try_count_words(json_string) {
        Ok(count) => context.env.create_uint32(count),
        Err(e) => Err(Error::from_reason(e.to_string()))
    }
}

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