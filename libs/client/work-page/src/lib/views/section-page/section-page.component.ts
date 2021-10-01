import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/work-page/sections';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthorsNotePos, Section, SectionForm, PublishSection } from '@dragonfish/shared/models/sections';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '@dragonfish/client/ui';
import { PopupModel } from '@dragonfish/shared/models/util';
import { AlertsService } from '@dragonfish/client/alerts';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { ActivatedRoute, Router } from '@angular/router';
import { slugify } from 'voca';

@UntilDestroy()
@Component({
    selector: 'dragonfish-section-page',
    templateUrl: './section-page.component.html',
    styleUrls: ['./section-page.component.scss'],
})
export class SectionPageComponent implements OnInit {
    createMode = false;
    previewMode = true;
    authorsNotePosOptions = AuthorsNotePos;

    sectionForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(AuthorsNotePos.Bottom),
    });

    constructor(
        public sectionsQuery: SectionsQuery,
        private sectionsService: SectionsService,
        public auth: AuthService,
        public workPageQuery: WorkPageQuery,
        private dialog: MatDialog,
        private alerts: AlertsService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.createMode = data.createMode;
        });
        this.sectionsQuery.current$.pipe(untilDestroyed(this)).subscribe((x) => {
            if (!isNullOrUndefined(x)) {
                this.sectionForm.setValue({
                    title: x.title,
                    body: x.body,
                    authorsNote: x.authorsNote,
                    authorsNotePos: x.authorsNotePos,
                });
            } else {
                this.sectionForm.setValue({
                    title: '',
                    body: '',
                    authorsNote: '',
                    authorsNotePos: AuthorsNotePos.Bottom,
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

        this.sectionsService.save(this.workPageQuery.contentId, section._id, sectionInfo).subscribe((section) => {
            this.router.navigate(['section', section._id, slugify(section.title)]);
        });
    }

    delete(sectionId: string) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.sectionsService.delete(this.workPageQuery.contentId, sectionId).subscribe();
            }
        });
    }

    pubUnPub(section: Section) {
        const pubStatus: PublishSection = {
            oldPub: section.published,
            newPub: !section.published,
        };

        this.sectionsService.publish(this.workPageQuery.contentId, section._id, pubStatus).subscribe();
    }

    private get fields() {
        return this.sectionForm.controls;
    }
}
