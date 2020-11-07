import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SectionItem } from '../viewmodels';

@Component({
    selector: 'section-item',
    templateUrl: './section-item.component.html',
    styleUrls: ['./section-item.component.less']
})
export class SectionItemComponent implements OnInit, OnChanges {
    @Input() section: SectionItem;
    @Input() selected: boolean;
    @Output() selectItem = new EventEmitter<boolean>();

    previewMode = true;

    editForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(null)
    });

    constructor() {}

    ngOnInit(): void {
        this.editForm.setValue({
            title: this.section.title,
            body: this.section.body,
            authorsNote: this.section.authorsNote,
            authorsNotePos: this.section.authorsNotePos
        });
    }

    ngOnChanges(): void {
        this.editForm.setValue({
            title: this.section.title,
            body: this.section.body,
            authorsNote: this.section.authorsNote,
            authorsNotePos: this.section.authorsNotePos
        });
    }

    select() {
        this.selectItem.emit(true);
        this.section.selected = true;
        this.selected = true;
    }

    switchView() {
        if (this.previewMode === true) {
            this.previewMode = false;
        } else {
            this.previewMode = true;
        }
    }
}