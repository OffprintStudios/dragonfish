import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { MatDialog } from '@angular/material/dialog';
import { InsertLinkComponent } from './components/insert-link/insert-link.component';
import { InsertMediaComponent } from './components/insert-media/insert-media.component';
import { take } from 'rxjs/operators';

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

    editMode = true;
    tempValue: string;

    value: string;
    onChange: (value: string) => void;
    onTouch: (value: boolean) => void;

    constructor(private alerts: AlertsService, private dialog: MatDialog) {}

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

    addInsert(insert: string) {
        const start = this.editor.nativeElement.selectionStart;
        const end = this.editor.nativeElement.selectionEnd;
        const inputText = this.editor.nativeElement.value;
        this.editor.nativeElement.value = inputText.substring(0, start) + insert + inputText.substr(end);
        this.editor.nativeElement.focus();
    }

    switchToPreview() {
        if (this.editMode === true) {
            this.tempValue = this.editor.nativeElement.value;
            this.editMode = false;
        }
    }

    switchToEdit() {
        if (this.editMode === false) {
            this.value = this.tempValue;
            this.editMode = true;
        }
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
                    this.addInsert(val);
                }
            });
    }

    openInsertMedia(title: string) {
        const ref = this.dialog.open(InsertMediaComponent, { data: { title: title } });
        ref.afterClosed()
            .pipe(take(1))
            .subscribe((val: string) => {
                if (val) {
                    this.addInsert(val);
                }
            });
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
