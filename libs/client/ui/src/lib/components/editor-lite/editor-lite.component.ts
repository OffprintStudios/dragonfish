import { Component, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'dragonfish-editor-lite',
    templateUrl: './editor-lite.component.html',
    styleUrls: ['./editor-lite.component.scss'],
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ height: 65, opacity: 0 }),
                animate('.250s ease-in-out', style({ height: 250, opacity: 1 })),
            ]),
            transition(':leave', [
                style({ height: 250, opacity: 1 }),
                animate('.250s ease-in-out', style({ height: 0, opacity: 0 })),
            ]),
        ]),
    ],
})
export class EditorLiteComponent {
    @Input() form: FormGroup;
    @Input() currUser: FrontendUser;
    @Input() expandable = false;
    @Input() placeholder = `Leave a reply.`;
    @Input() controlName: string;
    @Input() expandableTitle: string;
    @Output() triggerSubmit = new EventEmitter();
    @ViewChild('editor', { static: false }) editor: ElementRef<HTMLTextAreaElement>;

    private get fields() {
        return this.form.controls;
    }

    toggleExpandable = () => {
        this.expandable = !this.expandable;
    };

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
}
