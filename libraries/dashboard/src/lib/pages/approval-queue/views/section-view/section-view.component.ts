import { Component, OnInit } from '@angular/core';
import { SectionInfo } from '@dragonfish/models/content';
import { AuthorsNotePos, Section } from '@dragonfish/models/sections';
import { ActivatedRoute, Router } from '@angular/router';

import { Select, Store } from '@ngxs/store';
import { ContentState } from 'packages/client/src/app/shared/content';
import { Observable, zip } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ApprovalQueueState, AQNamespace } from 'packages/client/src/app/shared/dash/approval-queue';

@Component({
    selector: 'section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.less'],
})
export class SectionViewComponent implements OnInit {
    @Select(ApprovalQueueState.selectedDocSections) currSections$: Observable<SectionInfo[]>;
    @Select(ApprovalQueueState.selectedDocSection) currSection$: Observable<Section>;

    sections: SectionInfo[];
    loading = false;

    currIndex: number;
    indexNext: number;
    indexPrev: number;

    authorsNotePosOptions = AuthorsNotePos;

    constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
        this.fetchData();
    }

    ngOnInit(): void {}

    private fetchData() {
        this.loading = true;

        this.route.paramMap.subscribe((params) => {
            this.currIndex = +params.get('sectionNum') - 1;
            this.indexNext = this.currIndex + 1;
            this.indexPrev = this.currIndex - 1;

            this.currSections$.pipe(take(1)).subscribe((val) => {
                this.sections = val;

                this.store.dispatch(new AQNamespace.FetchSection(this.sections[this.currIndex]._id)).subscribe();
                this.loading = false;
            });
        });
    }

    goToNext() {
        const nextSection = this.sections[this.indexNext];
        this.router.navigate([`${this.indexNext + 1}`], { relativeTo: this.route.parent });
    }

    goToPrev() {
        const prevSection = this.sections[this.indexPrev];
        this.router.navigate([`${this.indexPrev + 1}`], { relativeTo: this.route.parent });
    }

    changeSection(section: SectionInfo) {
        const sectionIndex = this.sections.indexOf(section);
        this.router.navigate([`${sectionIndex + 1}`], { relativeTo: this.route.parent });
    }
}
