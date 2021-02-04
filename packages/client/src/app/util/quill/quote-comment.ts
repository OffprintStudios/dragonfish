import * as Quill from 'quill';

const Delta = Quill.import('delta');

export function quoteComment(body: string) {
    const commBody = new Delta(JSON.parse(body));
    console.log(`Original content:`);
    console.log(commBody);

    const newQuote = commBody.forEach((op) => {
        return op;
    });
    console.log(newQuote);
    /*const newQuote = commBody.insert({blockquote: true});
    console.log(`With blockquote:`);
    console.log(newQuote);
    return JSON.stringify(newQuote);*/
}
