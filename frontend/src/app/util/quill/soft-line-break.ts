import * as Quill from 'quill';

const LINE_SEPARATOR = '\u2028';
const Delta = Quill.import('delta');
const TextBlot = Quill.import('blots/text');

interface QuillRange {
    index: number;
    length: number;
}

/**
 * Extends and **replaces** the base Quill TextBlot. It gives it
 * the capacity to handle single line breaks, which are represented as the 
 * Unicode LINE SEPARATOR (U+2028) character.
 */
export class TextSoftBreakBlot extends TextBlot {
    // These two fields are "inherited" from TextBlot, but because we 
    // can't import it traditionally, we have to shadow them manually.
    protected text: string;
    public domNode!: Text;

    constructor(node: Node) {
        super(node);
        this.setText(this.text);
    }

    // Converts a DOM node to text to be stored in a Delta.
    static value(domNode: Text): string {
        return toDeltaText(TextBlot.value(domNode));
    }

    deleteAt(index: number, length: number): void {
        this.setText(this.text.slice(0, index) + this.text.slice(index + length));
    }

    insertAt(index: number, value: string, def?: any): void {
        if (def == null) {
            this.setText(this.text.slice(0, index) + value + this.text.slice(index));
        } else {
            this.insertAt(index, value, def);
        }
    }

    private setText(deltaText: string): void {
        this.text = deltaText;
        this.domNode.data = toDomText(deltaText);
    }
}

function toDeltaText(domText: string): string {
    // Text node content that ends in \n\n is rendered as two blank lines.
    // Convert to one line separator, and let the second \n be handled
    // by Quill closing the text block.
    return domText
        .replace(/\n\n$/, LINE_SEPARATOR)
        .replace(/\n/g, LINE_SEPARATOR);
}

function toDomText(deltaText: string): string {
    return deltaText
        .replace(new RegExp(`${LINE_SEPARATOR}$`), '\n\n')
        .replace(new RegExp(LINE_SEPARATOR, 'g'), '\n');
}

export function shiftEnterHandler(this: any, range: QuillRange) {
    this.quill.history.cutoff();
    // wrap this in cutoff()s so it gets seen as a single change
    const delta = new Delta()
        .retain(range.index)
        .delete(range.length)
        .insert(LINE_SEPARATOR);
    this.quill.updateContents(delta, Quill.sources.USER);

    this.quill.history.cutoff();

    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    console.log(this.quill.getContents());
}

export function brMatcher(node: Node) {
    // This behavior always interprets a BR as a soft line break,
    // which means that any lone <br>s will be folded into the next <p> or
    // (if there is no next paragraph) the previous <p>
    return new Delta().insert(LINE_SEPARATOR);
}

export function textNodeMatcher(node: any, delta: any) {
    // This code is almost identical to the default TextMatcher code--
    // just with extra calls to toDeltaText().
    let text = node.data;
    // Going to comment this out for now--it actually seems to result in 
    // WORSE imports from external sources (and Word).
    // Word represents empty line with <o:p>&nbsp;</o:p>
    // if (node.parentNode.tagName === 'O:P') {
    //     text = toDeltaText(text);
    //     return new Delta().insert(text.trim());
    // }
    // if (text.trim().length === 0 && text.includes('\n')) {
    //     return new Delta().insert(text);
    // }
    if (!isPre(node)) {
        const replacer = (collapse, match) => {
            const replaced = match.replace(/[^\u00a0]/g, ''); // \u00a0 is nbsp;
            return replaced.length < 1 && collapse ? ' ' : replaced;
        };
        text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
        text = text.replace(/\s\s+/g, replacer.bind(replacer, true)); // collapse whitespace
        if (
            (node.previousSibling == null && isLine(node.parentNode)) ||
            (node.previousSibling != null && isLine(node.previousSibling))
        ) {
            text = text.replace(/^\s+/, replacer.bind(replacer, false));
        }
        if (
            (node.nextSibling == null && isLine(node.parentNode)) ||
            (node.nextSibling != null && isLine(node.nextSibling))
        ) {
            text = text.replace(/\s+$/, replacer.bind(replacer, false));
        }
    }
    text = toDeltaText(text);
    return new Delta().insert(text);
}

// All the code below is taken from the default TextMatcher.
const preNodes = new WeakMap();
function isPre(node) {
    if (node == null) return false;
    if (!preNodes.has(node)) {
        if (node.tagName === 'PRE') {
            preNodes.set(node, true);
        } else {
            preNodes.set(node, isPre(node.parentNode));
        }
    }
    return preNodes.get(node);
}

function isLine(node) {
    if (node.childNodes.length === 0) return false; // Exclude embed blocks
    return [
        'address',
        'article',
        'blockquote',
        'canvas',
        'dd',
        'div',
        'dl',
        'dt',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'iframe',
        'li',
        'main',
        'nav',
        'ol',
        'output',
        'p',
        'pre',
        'section',
        'table',
        'td',
        'tr',
        'ul',
        'video',
    ].includes(node.tagName.toLowerCase());
}
