import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { MatDialog } from '@angular/material/dialog';
import { Editor } from '@tiptap/core';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Dropcursor from '@tiptap/extension-dropcursor';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import FloatingMenu from '@tiptap/extension-floating-menu';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import Iframe from './extensions/iframe';

@Component({
    selector: 'dragonfish-editor-lite',
    templateUrl: './editor-lite.component.html',
    styleUrls: ['./editor-lite.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: EditorLiteComponent,
            multi: true,
        },
    ],
    encapsulation: ViewEncapsulation.None,
})
export class EditorLiteComponent implements ControlValueAccessor, OnDestroy {
    @Input() disabled: boolean;
    @Input() attachedToTop = false;
    @Input() showBorders = true;
    alignmentMenuOpened = false;
    headingMenuOpened = false;
    linkMenuOpened = false;
    imageMenuOpened = false;
    mediaMenuOpened = false;

    editor = new Editor({
        extensions: [
            Bold,
            Italic,
            Underline,
            Strike,
            Paragraph,
            Text,
            BulletList,
            ListItem,
            OrderedList,
            Document,
            Gapcursor,
            HardBreak,
            Heading,
            History.configure({ levels: [2, 3, 4] } as any),
            HorizontalRule,
            Typography,
            Image.configure({
                inline: true,
            }),
            Link.configure({ openOnClick: false }),
            Iframe,
            Blockquote,
            Code,
            TextAlign.configure({
                types: ['paragraph', 'heading', 'image'],
            }),
            Placeholder,
            Dropcursor,
            BubbleMenu.configure({ element: document.querySelector('.menu') }),
            FloatingMenu.configure({ element: document.querySelector('.menu') }),
        ],
    });

    addLink = new FormGroup({
        link: new FormControl('', [Validators.required]),
    });

    addImage = new FormGroup({
        imageUrl: new FormControl('', [Validators.required]),
    });

    addMedia = new FormGroup({
        mediaUrl: new FormControl('', [Validators.required]),
    });

    value: string;
    onChange: (value: string) => void;
    onTouch: (value: boolean) => void;

    constructor(private alerts: AlertsService, private dialog: MatDialog) {}

    ngOnDestroy() {
        this.editor.destroy();
    }

    chainCommand() {
        return this.editor.chain().focus();
    }

    openEmojiPicker() {
        this.alerts.info(`This feature is not yet available.`);
    }

    openInsertLink() {
        this.linkMenuOpened = !this.linkMenuOpened;
    }

    openImageMenu() {
        this.imageMenuOpened = !this.imageMenuOpened;
    }

    openMediaMenu() {
        this.mediaMenuOpened = !this.mediaMenuOpened;
    }

    insertLink() {
        if (this.addLink.controls.link.value) {
            this.editor.chain().focus().setLink({ href: this.addLink.controls.link.value }).run();
            this.addLink.reset();
            this.linkMenuOpened = false;
        }
    }

    insertImage() {
        if (this.addImage.controls.imageUrl.value) {
            this.editor.chain().focus().setImage({ src: this.addImage.controls.imageUrl.value }).run();
            this.addImage.reset();
            this.imageMenuOpened = false;
        }
    }

    insertMedia() {
        if (this.addMedia.controls.mediaUrl.value) {
            const link = `https://www.youtube.com/embed/${this.parseMediaLink(this.addMedia.controls.mediaUrl.value)}`;
            this.editor.chain().focus().setIframe({ src: link }).run();
            this.addMedia.reset();
            this.mediaMenuOpened = false;
        }
    }

    writeValue(obj: string): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private parseMediaLink(url: string) {
        const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return undefined !== arr[2] ? arr[2].split(/[^\w-]/i)[0] : arr[0];
    }
}
