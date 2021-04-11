import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AlertsService } from '@dragonfish/client/alerts';
import { PoetryContent, ContentKind, PubStatus, WorkStatus, PoetryForm } from '@dragonfish/shared/models/content';
import { AuthorsNotePos, Section, SectionForm } from '@dragonfish/shared/models/sections';
import { MyStuffService } from '../../repo/services';
import { MyStuffState } from '../../repo';
import { SectionsState, SectionsStateModel } from '../../repo/sections';

@Component({
    selector: 'dragonfish-view-poetry',
    templateUrl: './view-poetry.component.html',
    styleUrls: ['./view-poetry.component.scss']
})
export class ViewPoetryComponent {
    @Select(MyStuffState.currContent) currContent$: Observable<PoetryContent>;
    @Select(SectionsState) sectionsState$: Observable<SectionsStateModel>;

    editMode = false;
    selectedPos = AuthorsNotePos.Bottom;
    authorsNotePosOptions = AuthorsNotePos;

    sectionForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(null),
    });

    constructor(
        private stuff: MyStuffService,
        public route: ActivatedRoute,
        private alerts: AlertsService,
    ) {}

    exitEditMode() {
        this.editMode = false;
    }

    get fields() {
        return this.sectionForm.controls;
    }

    addSection() {
        this.editMode = true;
    }

    setCurrSection(section: Section) {
        this.stuff.setCurrentSection(section);
    }

    submitForm(contentId: string) {
        if (this.fields.title.invalid) {
            this.alerts.warn(`Chapter titles need to be between 3 and 100 characters long.`);
            return;
        }

        if (this.fields.body.invalid) {
            this.alerts.warn(`Chapters need to be more than 3 characters long.`);
            return;
        }

        if (this.fields.authorsNote.invalid) {
            this.alerts.warn(`Authors notes need to be more than 3 characters long.`);
            return;
        }

        const sectionForm: SectionForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            authorsNote: this.fields.authorsNote.value,
            authorsNotePos: this.fields.authorsNotePos.value,
            usesNewEditor: true,
        };

        this.stuff.createSection(contentId, sectionForm);
        this.editMode = false;
    }
}
