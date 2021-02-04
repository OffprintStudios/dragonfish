// In Webpack 4 and earlier, synchronous loading of WASM isn't supported.
// So instead, we do an old-style async import(), and export the promise.
// It's up to the caller to resolve it at some point.
let html_sanitizer_promise = import('./lib/html_sanitizer');

/**
 * Takes the given HTML string and removes anything not allowed.
 * Preserves inline styles on div, p, a, img, and h1-h6 tags.
 * @param htmlText A string containing HTML to be sanitized.
 */
export async function sanitizeHtml(htmlText: string): Promise<string> {
    let wasm_module = await html_sanitizer_promise;
    return wasm_module.sanitize_html(htmlText);
}

/**
 * Attempts to remove **all** HTML from the given string, and returns only
 * the text contained within.
 * @param htmlText A string containing the HTML to be sanitized.
 */
export async function stripAllHtml(htmlText: string): Promise<string> {
    let wasm_module = await html_sanitizer_promise;
    return wasm_module.strip_all_html(htmlText);
}
