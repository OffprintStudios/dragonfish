// In Webpack 4 and earlier, synchronous loading of WASM isn't supported.
// So instead, we do an old-style async import(), and export the promise.
// It's up to the caller to resolve it at some point.
let word_counter_promise = import('./lib/word_counter');

/** Counts the number of words in the given JSON blob full of Quill deltas.
 * @param {string} bodyText A JSON blob made of Quill Deltas.
 * @returns {number} The number of words in the submitted text.
 */
export async function countQuillWords(bodyText: string): Promise<number> {
    let wasm_module = await word_counter_promise;
    return wasm_module.count_quill_words(bodyText);
}

/**
 * Counts the number of words in a string of plain text.
 * @param bodyText A string of plain text.
 * @returns {number} The number of words in the submitted text.
 */
export async function countPlaintextWords(bodyText: string): Promise<number> {
    let wasm_module = await word_counter_promise;
    return wasm_module.count_plaintext_words(bodyText);
}
