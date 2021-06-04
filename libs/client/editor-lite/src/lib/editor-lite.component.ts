import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
})
export class EditorLiteComponent implements ControlValueAccessor {
    @Input() placeholder = `Leave a reply.`;
    @Input() disabled: boolean;
    @ViewChild('editor', { static: false }) editor: ElementRef<HTMLTextAreaElement>;

    value: string;
    onChange: (value: string) => void;
    onTouch: (value: boolean) => void;

    addSimpleTag(tag: string) {
        const start = this.editor.nativeElement.selectionStart;
        const end = this.editor.nativeElement.selectionEnd;
        const inputText = this.editor.nativeElement.value;
        const stringToModify = inputText.substring(start, end);
        const modifiedString = tag + stringToModify + tag;
        this.editor.nativeElement.value = inputText.substring(0, start) + modifiedString + inputText.substr(end);
        this.editor.nativeElement.focus();
        this.editor.nativeElement.selectionStart = start + tag.length + 2;
        this.editor.nativeElement.selectionEnd = end + tag.length + 2;
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
