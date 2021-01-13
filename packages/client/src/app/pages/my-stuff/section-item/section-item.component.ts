import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SectionsService } from '../../../services/user';
import { AuthorsNotePos, PublishSection, SectionForm } from '@pulp-fiction/models/sections';
import { SectionItem } from '../viewmodels';
import { getQuillHtml } from '../../../util/functions';

@Component({
    selector: 'section-item',
    templateUrl: './section-item.component.html',
    styleUrls: ['./section-item.component.less']
})
export class SectionItemComponent implements OnInit, OnChanges {
    @Input() contentId: string;
    @Input() section: SectionItem;
    @Input() selected: boolean;
    @Output() selectItem = new EventEmitter<boolean>();

    previewMode = true;
    authorsNotePosOptions = AuthorsNotePos;

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
        // First, clear the contents of the Body and Author's Note. This is because
        // Quill REALLY struggles when making large changes. However, going to
        // or from an empty string is very fast.
        this.editForm.setValue({
            title: "",
            body: "",
            authorsNote: "",
            authorsNotePos: AuthorsNotePos.Bottom
        });

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

        const bodyValue = this.section.usesNewEditor 
            ? this.fields.body.value
            : getQuillHtml(document.querySelector("quill-editor"));

        const authorsNoteValue = this.section.usesNewEditor 
            ? this.fields.authorsNote.value
            : getQuillHtml(document.querySelector("div.authors-note"));

        const sectionInfo: SectionForm = {
            title: this.fields.title.value,
            body: bodyValue,
            usesNewEditor: true,
            authorsNote: authorsNoteValue,
            authorsNotePos: this.fields.authorsNotePos.value,
            oldWords: this.section.stats.words
        };

        this.sectionsService.editSection(this.contentId, this.section._id, sectionInfo).subscribe(sec => {
            this.section = sec as SectionItem;
            this.switchView();
            this.snackBar.open(`Your changes have been saved!`);
        }, err => {
            this.snackBar.open(`Something went wrong saving this section!`);
        });
    }

    deleteSection() {
        this.sectionsService.deleteSection(this.contentId, this.section._id).subscribe(() => {
            location.reload();
        });
    }

    pubUnpub() {
        const pubStatus: PublishSection = {
            oldPub: this.section.published,
            newPub: !this.section.published
        }

        this.sectionsService.publishSection(this.contentId, this.section._id, pubStatus).subscribe(sec => {
            this.section = sec as SectionItem;
            location.reload();
        });
    }
}