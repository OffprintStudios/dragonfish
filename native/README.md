# Native Modules 

Some portions of the pulp-fiction backend are written in native code for the sake of performance. The source code for thoe native modules can be found here.

#### Table of contents
* [Creating a new native module](#creating-a-new-native-module)  
* [Writing your module](#writing-your-module)  
  * [Declaring functions](#declaring-functions)  
  * [Parameters](#parameters)
  * [Return values](#return-values)
* [Using it from TypeScript](#using-it-from-typescript)
* [Building your module](#building-your-module)

## Creating a new native module

Native modules are written in [Rust](https://www.rust-lang.org/), and use [NodeJS's N-API ](https://nodejs.org/api/n-api.html) to communicate with the rest of the backend.

The basics of creating a new native module are the following:

First, **from the root folder of the repository**, create a new home for your module:
```bash
cargo new ./native/your_module_name
```

Cargo will complain about the package beliieving it's in a workspace, when it's not. It is correct! We need to go add our new module to the topmost `Cargo.toml`, at the repository root. 

Open it, and find the section that looks like this:
```toml
members = [
    "native/word_counter",
]
```
...and add your new module to it:
```toml
members = [
    "native/word_counter",
    "native/your_module_name",
]
```

Now let's add the N-API pieces to the Rust crate. Navigate to `/native/your_module_name/Cargo.toml`, and add the following sections:
```toml
[dependencies]
napi = "0.4"
napi-derive = "0.4"

[build-dependencies]
napi-build = "0.2"

[lib]
crate-type = ["cdylib"]
```
You'll also need to add a `build.rs` file to `/native/your_module_name`. It should look like this:

```rust
// build.rs
extern crate napi_build;

fn main() {
  napi_build::setup();
}
```

Finally, you need to do a little bit of bookkeeping with N-API to get your native module registered. Add the following to your `src/lib.rs` file:
```rust
// This is just a good habit.
#![forbid(unsafe_code)]

// These are the bare minimum imports you'll need. It's likely you'll use more.
use napi::{CallContext, Module, Result, register_module};
use napi_derive::js_function;

register_module!(your_module_name, init);

fn init(module: &mut Module) -> Result<()> {
    module.create_named_method("yourFunctionNameInJavascript", your_function_name_in_rust)?;
    Ok(())
}
```

And that's it! Now, when you run `yarn buildNativeModules`, `cargo` will attempt to compile your Rust package, and it'll be copied to where it belongs.

## Writing your module

Any function that needs to be exposed to Javascript should 1) be marked with the `#[js_function()]` attribute, and 2) declared in your `init()` function using `module.create_named_method()`.

### Delcaring functions

Functions should be marked with `#[js_function(n)]`, where `n` is the number of arguments your function takes. If it takes 0 arguments, it can be omitted: `#[js_function]`.

All functions must accept a single argument of type `napi::CallContext`, and return a `napi::Result<T>`, where `T` should be a `napi::Js(something)` i.e. `JsNumber` or `JsString`.

### Parameters

Parameters can be extracted from the `CallContext` object. For example, if your function's first argument was a Javascript string, you could retrieve it with the following call:
```rust
let js_string = context.get::<JsString>(0)?;
```

### Return values

All functions exposed to Javascript must return `napi::Result<T>` where `T` should be a `napi::Js(something)` i.e. `JsNumber` or `JsString`. 

An `OK(T)` will automatically be coerced into a `T` on the Javascript side, while an `Err()` will be raised as an exception.

In order to convert an `Error` of another type to `napi::Error`, `napi::Error` has several static methods that can be used to create errors. Of particluar note is `napi::Error::from_reason(&str)`.

## Using it from TypeScript

First, it's good form to create a small shim to export the native functions without exposing the gory details.

Create a file in `/native/your_module_name/` named `yourModuleName.ts`.

In order to access the native module, it has to be imported. Because the import path is dynamically determined, we should use the helper from `/src/util/native-library-locator.ts`, and use TypeScript's async `import()`. 

Something like this:
```ts
import { getNativeLibPath } from '../../src/util/native-library-locator';
import * as path from 'path';

let yourModuleName: any = undefined;

async function getyourModuleName(): Promise<any> {
    if (yourModuleName) {
        // Some extra caching, for performance
        return yourModuleName;
    }

    yourModuleName = await import(path.join(getNativeLibPath(), "your_module_name.node"));
    return yourModuleName;
}
```

And let's suppose you wanted to expose your native module's `do_the_thing()` function, which you registered in the `init()` function as `doTheThing()`. That might look something like this:

```ts
export async function doTheThing(): Promise {        
    try {        
        const yourModule = await getyourModuleName();
        yourModule.doTheThing();
    } catch(e) {
        console.log(`Failed to do the thing: ${e}`);
    }
}
```

...which can then be imported and used like any other function!

## Building your module

From the repo root, run 

```bash
yarn buildNativeModules
``` 
This will automatically build every native module declared in the topmost `Cargo.toml` in `release` configuration, and copy them to the `/usr/local/lib/pulpfiction/` directory by default.