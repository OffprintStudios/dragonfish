import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PoetryContent, PubStatus, ContentKind, PoetryForm, WorkStatus } from '@dragonfish/models/content';
import { AuthorsNotePos, Section, SectionForm } from '@dragonfish/models/sections';
import { UploadCoverartComponent } from '../../components';
import { MyStuffFacade } from '../../facades';
import { AlertsService } from '@dragonfish/alerts';
import { MyStuffState } from '../../shared';
import { SectionsState, SectionsStateModel } from '../../shared/sections';

@Component({
    selector: 'view-poetry',
    templateUrl: './view-poetry.component.html',
    styleUrls: ['./view-poetry.component.less'],
})
export class ViewPoetryComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<PoetryContent>;
    @Select(MyStuffState.currContentWordCount) currContentWordCount$: Observable<number>;
    @Select(SectionsState) sectionsState$: Observable<SectionsStateModel>;

    pubStatus = PubStatus;
    contentStatus = WorkStatus;
    editMode = false;
    addEditIcon = false;
    forms = PoetryForm;

    selectedPos = AuthorsNotePos.Bottom;
    authorsNotePosOptions = AuthorsNotePos;

    sectionForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(null),
    });

    constructor(
        private stuff: MyStuffFacade,
        public route: ActivatedRoute,
        private alerts: AlertsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {}

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
        this.stuff.setCurrSection(section);
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

    uploadCoverart(contentId: string) {
        this.dialog.open(UploadCoverartComponent, { data: { kind: ContentKind.PoetryContent, contentId: contentId } });
    }
}
