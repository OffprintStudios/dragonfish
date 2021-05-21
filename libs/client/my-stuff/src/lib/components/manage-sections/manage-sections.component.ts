import { Component } from '@angular/core';
import { AuthorsNotePos, Section, SectionForm } from '@dragonfish/shared/models/sections';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { MyStuffQuery, MyStuffService } from '@dragonfish/client/repository/my-stuff';
import { SectionsService, SectionsQuery } from '@dragonfish/client/repository/my-stuff/sections';
import { zip } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'dragonfish-manage-sections',
    templateUrl: './manage-sections.component.html',
    styleUrls: ['./manage-sections.component.scss'],
})
export class ManageSectionsComponent {
    editMode = false;
    selectedPos = AuthorsNotePos.Bottom;
    authorsNotePosOptions = AuthorsNotePos;

    allNeededParts = zip(
        this.stuffQuery.current$,
        this.sectionsQuery.all$,
        this.sectionsQuery.current$
    ).pipe(untilDestroyed(this));

    sectionForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(AuthorsNotePos.Bottom),
    });

    constructor(
        private stuff: MyStuffService,
        public stuffQuery: MyStuffQuery,
        public sectionsQuery: SectionsQuery,
        private sections: SectionsService,
        private alerts: AlertsService
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
        this.stuff.setActive(section._id);
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

        this.sections.create(contentId, sectionForm);
        this.editMode = false;
    }
}
