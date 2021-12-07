import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/work-page/sections';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthorsNotePos, Section, SectionForm, PublishSection } from '@dragonfish/shared/models/sections';
import { AlertsService } from '@dragonfish/client/alerts';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { ActivatedRoute, Router } from '@angular/router';
import { slugify } from 'voca';
import { Location } from '@angular/common';
import { setTwoPartTitle, setThreePartTitle } from '@dragonfish/shared/constants';

@UntilDestroy()
@Component({
    selector: 'dragonfish-section-page',
    templateUrl: './section-page.component.html',
    styleUrls: ['./section-page.component.scss'],
})
export class SectionPageComponent implements OnInit {
    createMode = false;
    previewMode = true;
    sectionListOpened = false;
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
        private alerts: AlertsService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
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

                setThreePartTitle(this.workPageQuery.contentTitle, x.title);
            } else {
                this.sectionForm.setValue({
                    title: '',
                    body: '',
                    authorsNote: '',
                    authorsNotePos: AuthorsNotePos.Bottom,
                });

                setTwoPartTitle(this.workPageQuery.contentTitle);
            }
        });
    }

    switchView() {
        this.previewMode = this.previewMode !== true;
    }

    toggleSectionList() {
        this.sectionListOpened = !this.sectionListOpened;
    }

    goBackToWork() {
        if (this.workPageQuery.contentKind === 'PoetryContent') {
            return ['/poetry', this.workPageQuery.contentId, slugify(this.workPageQuery.contentTitle)];
        } else if (this.workPageQuery.contentKind === 'ProseContent') {
            return ['/prose', this.workPageQuery.contentId, slugify(this.workPageQuery.contentTitle)];
        }
    }

    goToSectionAuthor(sectionId: string) {
        if (this.workPageQuery.contentKind === 'PoetryContent') {
            return [
                '/poetry',
                this.workPageQuery.contentId,
                slugify(this.workPageQuery.contentTitle),
                'view-section',
                sectionId,
            ];
        } else if (this.workPageQuery.contentKind === 'ProseContent') {
            return [
                '/prose',
                this.workPageQuery.contentId,
                slugify(this.workPageQuery.contentTitle),
                'view-section',
                sectionId,
            ];
        }
    }

    goToSectionReader(index: number, title: string) {
        if (this.workPageQuery.contentKind === 'PoetryContent') {
            return [
                '/poetry',
                this.workPageQuery.contentId,
                slugify(this.workPageQuery.contentTitle),
                'section',
                index + 1,
                slugify(title),
            ];
        } else if (this.workPageQuery.contentKind === 'ProseContent') {
            return [
                '/prose',
                this.workPageQuery.contentId,
                slugify(this.workPageQuery.contentTitle),
                'section',
                index + 1,
                slugify(title),
            ];
        }
    }

    goToNext() {
        if (this.sectionsQuery.currIndex !== this.sectionsQuery.pubSections.length) {
            this.router.navigate(['section', this.sectionsQuery.nextPage, 'next'], { relativeTo: this.route.parent });
        }
    }

    goToPrev() {
        if (this.sectionsQuery.lastPage !== 0) {
            this.router.navigate(['section', this.sectionsQuery.lastPage, 'prev'], { relativeTo: this.route.parent });
        }
    }

    saveChanges(section?: Section) {
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
            oldWords: section ? section.stats.words : null,
        };

        if (this.createMode === true) {
            this.sectionsService.create(this.workPageQuery.contentId, sectionInfo).subscribe((content) => {
                this.router.navigate(['section', content._id, slugify(content.title)], {
                    relativeTo: this.route.parent,
                });
            });
        } else {
            this.sectionsService.save(this.workPageQuery.contentId, section._id, sectionInfo).subscribe(() => {
                this.previewMode = true;
            });
        }
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
