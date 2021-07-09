import { Component } from '@angular/core';
import { SectionInfo } from '@dragonfish/shared/models/content';
import { AuthorsNotePos } from '@dragonfish/shared/models/sections';
import { ActivatedRoute, Router } from '@angular/router';
import { slugify } from 'voca';
import { take } from 'rxjs/operators';
import { ApprovalQueueQuery, ApprovalQueueService } from '@dragonfish/client/repository/dashboard/approval-queue';

@Component({
    selector: 'dragonfish-section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.scss'],
})
export class SectionViewComponent {
    sections: SectionInfo[];
    loading = false;

    currIndex: number;
    indexNext: number;
    indexPrev: number;

    authorsNotePosOptions = AuthorsNotePos;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public queueQuery: ApprovalQueueQuery,
        private queueService: ApprovalQueueService,
    ) {
        this.fetchData();
    }

    private fetchData() {
        this.loading = true;

        this.route.paramMap.subscribe((params) => {
            this.currIndex = +params.get('sectionNum') - 1;
            this.indexNext = this.currIndex + 1;
            this.indexPrev = this.currIndex - 1;

            this.queueQuery.selectedSections$.pipe(take(1)).subscribe((val) => {
                this.sections = val;

                this.queueService.fetchSection(this.sections[this.currIndex]._id).subscribe(() => {
                    this.loading = false;
                });
            });
        });
    }

    goToNext() {
        const nextSection = this.sections[this.indexNext];
        this.router.navigate([`${this.indexNext + 1}/${slugify(nextSection.title)}`], {
            relativeTo: this.route.parent,
        });
    }

    goToPrev() {
        const prevSection = this.sections[this.indexPrev];
        this.router.navigate([`${this.indexPrev + 1}/${slugify(prevSection.title)}`], {
            relativeTo: this.route.parent,
        });
    }

    changeSection(section: SectionInfo) {
        const sectionIndex = this.sections.indexOf(section);
        this.router.navigate([`${sectionIndex + 1}/${slugify(section.title)}`], { relativeTo: this.route.parent });
    }
}
