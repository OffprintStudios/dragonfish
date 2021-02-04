import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { MyStuffState } from '../../../../shared/my-stuff';
import { Observable } from 'rxjs';

import { ContentKind, ProseContent, PubStatus, WorkStatus } from '@dragonfish/models/content';
import { AuthorsNotePos, Section, SectionForm } from '@dragonfish/models/sections';
import { MatDialog } from '@angular/material/dialog';
import { SectionsState, SectionsStateModel } from 'packages/client/src/app/shared/my-stuff/sections';
import { AlertsService } from 'packages/client/src/app/shared/alerts';
import { MyStuffService } from '../../my-stuff.service';
import { UploadCoverartComponent } from '../../components';

@Component({
    selector: 'view-prose',
    templateUrl: './view-prose.component.html',
    styleUrls: ['./view-prose.component.less'],
})
export class ViewProseComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<ProseContent>;
    @Select(MyStuffState.currContentWordCount) currContentWordCount$: Observable<number>;
    @Select(SectionsState) sectionsState$: Observable<SectionsStateModel>;
    pubStatus = PubStatus;
    contentStatus = WorkStatus;
    editMode = false;
    addEditIcon = false;

    selectedPos = AuthorsNotePos.Bottom;
    authorsNotePosOptions = AuthorsNotePos;

    sectionForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(AuthorsNotePos.Bottom),
    });

    constructor(
        public route: ActivatedRoute,
        private alerts: AlertsService,
        private dialog: MatDialog,
        private stuff: MyStuffService,
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
        this.dialog.open(UploadCoverartComponent, { data: { kind: ContentKind.ProseContent, contentId: contentId } });
    }
}
