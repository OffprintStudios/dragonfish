import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';

export interface IframeOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        iframe: {
            /**
             * Add an iframe
             */
            setIframe: (options: { src: string; title?: string }) => ReturnType;
        };
    }
}

export const inputRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export const Iframe = Node.create<IframeOptions>({
    name: 'iframe',
    defaultOptions: {
        HTMLAttributes: {},
    },
    draggable: true,
    addAttributes() {
        return {
            src: {
                default: null,
            },
            title: {
                default: null,
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'iframe[src]',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },
    addCommands() {
        return {
            setIframe: (options) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
    addInputRules() {
        return [
            nodeInputRule(inputRegex, this.type, (match) => {
                const [, src, title] = match;
                return { src, title };
            }),
        ];
    },
});
