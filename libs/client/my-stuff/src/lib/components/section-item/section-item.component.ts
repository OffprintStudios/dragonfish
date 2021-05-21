import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertsService } from '@dragonfish/client/alerts';
import { Section, AuthorsNotePos, SectionForm, PublishSection } from '@dragonfish/shared/models/sections';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/my-stuff/sections';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
    selector: 'dragonfish-section-item',
    templateUrl: './section-item.component.html',
    styleUrls: ['./section-item.component.scss']
})
export class SectionItemComponent implements OnInit {
    @Input() contentId: string;

    previewMode = true;
    authorsNotePosOptions = AuthorsNotePos;

    editForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(null),
    });

    constructor(
        private alerts: AlertsService,
        private sections: SectionsService,
        public sectionsQuery: SectionsQuery,
        private dialog: MatDialog,
    ) {}

    get fields() {
        return this.editForm.controls;
    }

    ngOnInit(): void {
        this.sectionsQuery.current$.pipe(untilDestroyed(this)).subscribe((x) => {
            if (x !== null) {
                this.editForm.setValue({
                    title: x.title,
                    body: x.body,
                    authorsNote: x.authorsNote,
                    authorsNotePos: x.authorsNotePos,
                });
            } else {
                this.editForm.setValue({
                    title: '',
                    body: '',
                    authorsNote: '',
                    authorsNotePos: null,
                });
            }
        });
    }

    switchView() {
        this.previewMode = this.previewMode !== true;
    }

    saveChanges(section: Section) {
        if (this.fields.title.invalid) {
            this.alerts.warn(`Titles must be between 3 and 100 characters.`);
            return;
        }

        if (this.fields.body.invalid) {
            this.alerts.warn(`Body text must be more than 3 characters long.`);
            return;
        }

        const sectionInfo: SectionForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            usesNewEditor: true,
            authorsNote: this.fields.authorsNote.value,
            authorsNotePos: this.fields.authorsNotePos.value,
            oldWords: section.stats.words,
        };

        this.sections.save(this.contentId, section._id, sectionInfo).subscribe();
    }

    delete(sectionId: string) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.sections.delete(this.contentId, sectionId).subscribe();
            }
        });
    }

    pubUnpub(section: Section) {
        const pubStatus: PublishSection = {
            oldPub: section.published,
            newPub: !section.published,
        };

        this.sections.publish(this.contentId, section._id, pubStatus).subscribe();
    }
}
