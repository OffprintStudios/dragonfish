import { getNativeLibPath } from '../../src/util/native-library-locator';
import * as path from 'path';

/**
 * Takes a JSON string containing Quill deltas, and returns a word count.
 * @param bodyContent A JSON string containing a set of Quill deltas.
 */
export async function countQuillWords(bodyContent: string): Promise<number> {        
    try {        
        const word_counter = await getWordCounter();
        return word_counter.countWords(bodyContent);
    } catch(e) {
        console.log(`Failed to count words: ${e}`);
    }
}

let wordCounter: any = undefined;
async function getWordCounter(): Promise<any> {
    if (wordCounter) {
        return wordCounter;
    }

    wordCounter = await import(path.join(getNativeLibPath(), "word_counter.node"));
    return wordCounter;
}