import * as Quill from 'quill';

const Embed = Quill.import('blots/block/embed');

export class Divider extends Embed {
    static blotName = 'divider';
    static tagName = 'hr';
}

export function dividerHandler(this: any) {
    console.log(this);
    const range = this.quill.getSelection(true);
    this.quill.insertText(range.index, `\n`, Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
}
