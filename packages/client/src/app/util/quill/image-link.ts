import * as Quill from 'quill';

export function imageHandler(this: any) {
    let range = this.quill.getSelection(true);
    let source = prompt(`What is the image URL?`);
    this.quill.insertEmbed(range.index, 'image', source, Quill.sources.USER);
}
