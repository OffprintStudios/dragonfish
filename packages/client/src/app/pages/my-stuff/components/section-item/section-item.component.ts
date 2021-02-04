import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AuthorsNotePos, PublishSection, Section, SectionForm } from '@dragonfish/models/sections';
import { SectionsState } from '../../../../shared/my-stuff/sections';
import { AlertsService } from '../../../../shared/alerts';
import { MyStuffService } from '../../my-stuff.service';

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

    constructor(private alerts: AlertsService, private stuff: MyStuffService) {}

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

        this.stuff.saveSection(this.contentId, section._id, sectionInfo);
    }

    delete(sectionId: string) {
        this.stuff.deleteSection(this.contentId, sectionId);
    }

    pubUnpub(section: Section) {
        const pubStatus: PublishSection = {
            oldPub: section.published,
            newPub: !section.published,
        };

        this.stuff.publishSection(this.contentId, section._id, pubStatus);
    }
}
