const word_counter = require('../compiled/word_counter.node');

/**
 * Takes a JSON string containing Quill deltas, and returns a word count.
 * @param bodyContent A JSON string containing a set of Quill deltas.
 */
export function countQuillWords(bodyContent: string): number {        
    try {        
        return word_counter.countWords(bodyContent);
    } catch(e) {
        console.log(`Failed to count words: ${e}`);
    }
}