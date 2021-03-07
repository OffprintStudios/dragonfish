import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AuthorsNotePos, PublishSection, Section, SectionForm } from '@dragonfish/models/sections';
import { Sections, SectionsState } from '../../shared/sections';
import { AlertsService } from '@dragonfish/alerts';
import { colorTagCheck } from '@dragonfish/utilities/functions';

@UntilDestroy()
@Component({
    selector: 'section-item',
    templateUrl: './section-item.component.html',
    styleUrls: ['./section-item.component.less'],
})
export class SectionItemComponent implements OnInit {
    @Select(SectionsState.currSection) currSection$: Observable<Section>;

    @Input() contentId: string;

    previewMode = true;
    authorsNotePosOptions = AuthorsNotePos;

    editForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        authorsNote: new FormControl('', [Validators.minLength(3)]),
        authorsNotePos: new FormControl(null),
    });

    constructor(private alerts: AlertsService, private store: Store) {}

    get fields() {
        return this.editForm.controls;
    }

    ngOnInit(): void {
        this.currSection$.pipe(untilDestroyed(this)).subscribe((x) => {
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
        if (this.previewMode === true) {
            this.previewMode = false;
        } else {
            this.previewMode = true;
        }
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

        this.store.dispatch(new Sections.Save(this.contentId, section._id, sectionInfo)).subscribe();

        // colorTagCheck("Body", sectionInfo.body, this.alerts);
        // colorTagCheck("Author's note", sectionInfo.authorsNote, this.alerts);
    }

    delete(sectionId: string) {
        this.store.dispatch(new Sections.Delete(this.contentId, sectionId)).subscribe();
    }

    pubUnpub(section: Section) {
        const pubStatus: PublishSection = {
            oldPub: section.published,
            newPub: !section.published,
        };

        this.store.dispatch(new Sections.Publish(this.contentId, section._id, pubStatus));
    }
}
