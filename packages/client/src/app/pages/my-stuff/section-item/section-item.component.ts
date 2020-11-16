import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SectionsService } from '../../../services/user';
import { SectionForm } from '@pulp-fiction/models/sections';
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

    constructor(private snackBar: MatSnackBar, private sectionsService: SectionsService) {}

    get fields() { return this.editForm.controls; }

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

    saveChanges() {
        if (this.fields.title.invalid) {
            this.snackBar.open(`Titles must be between 3 and 100 characters.`);
            return;
        }

        if (this.fields.body.invalid) {
            this.snackBar.open(`Body text must be more than 3 characters long.`);
            return;
        }

        const sectionInfo: SectionForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            usesNewEditor: true,
            authorsNote: this.fields.authorsNote.value,
            authorsNotePos: this.fields.authorsNotePos.value
        };

        
    }

    deleteSection() {

    }

    publishSection() {
        
    }
}