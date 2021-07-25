import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { InsertLinkComponent } from './components/insert-link/insert-link.component';
import { InsertMediaComponent } from './components/insert-media/insert-media.component';
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
import Iframe from './extensions';

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
    alignmentMenuOpened = false;
    headingMenuOpened = false;

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
            Image,
            Link.configure({ openOnClick: false }),
            Blockquote,
            Code,
            TextAlign,
            Placeholder,
            Dropcursor,
            Iframe,
            BubbleMenu.configure({ element: document.querySelector('.menu') }),
            FloatingMenu.configure({ element: document.querySelector('.menu') }),
        ],
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
        const ref = this.dialog.open(InsertLinkComponent);
        ref.afterClosed()
            .pipe(take(1))
            .subscribe((val: string) => {
                if (val) {
                    this.editor.chain().focus().setLink({ href: val }).run();
                }
            });
    }

    openInsertMedia(title: string) {
        if (title === 'Insert Image') {
            const ref = this.dialog.open(InsertMediaComponent, { data: { title: title } });
            ref.afterClosed()
                .pipe(take(1))
                .subscribe((val: string) => {
                    this.editor.chain().focus().setImage({ src: val }).run();
                });
        } else {
            this.alerts.info(`This feature is not yet supported!`);
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
}
