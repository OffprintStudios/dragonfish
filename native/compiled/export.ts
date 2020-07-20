const word_counter = require('./word_counter.node');

export function count(bodyContent: string): number {    
    return word_counter.countWords(bodyContent);
}