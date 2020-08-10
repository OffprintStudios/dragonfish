import * as Quill from 'quill';

const Embed = Quill.import('blots/block/embed');

export class Divider extends Embed {
    static blotName = 'divider';
    static tagName = 'hr';
}

export function dividerHandler(this: any) {
    console.log(this);
    this.quill.format('divider', true);
}
