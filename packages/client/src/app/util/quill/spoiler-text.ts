import * as Quill from 'quill';

const Block = Quill.import('blots/block');

export class Spoiler extends Block {
    static blotName = 'spoiler';
    static className = 'spoiler';
    static tagName = 'span';
}
