import { Component } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { slugify } from 'voca';
import { ContentState, FetchSection } from '@dragonfish/client/repository/content';
import { Section, AuthorsNotePos } from '@dragonfish/shared/models/sections';
import { ContentModel, SectionInfo } from '@dragonfish/shared/models/content';
import { setThreePartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.scss'],
})
export class SectionViewComponent {
    @Select(ContentState.currContent) currContent$: Observable<ContentModel>;
    @Select(ContentState.currSection) currSection$: Observable<Section>;

    currContent: ContentModel;
    sections: SectionInfo[];
    thisSection: Section;
    loading = false;

    currIndex: number;
    indexNext: number;
    indexPrev: number;

    authorsNotePosOptions = AuthorsNotePos;

    constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
        this.fetchData();
    }

    private fetchData() {
        this.loading = true;

        this.route.paramMap.subscribe((params) => {
            this.sections = this.store.selectSnapshot<SectionInfo[]>(ContentState.currSections);

            this.currIndex = +params.get('sectionNum') - 1;
            this.indexNext = this.currIndex + 1;
            this.indexPrev = this.currIndex - 1;

            this.store.dispatch(new FetchSection(this.sections[this.currIndex]._id)).subscribe(() => {
                this.loading = false;

                zip(this.currContent$, this.currSection$).subscribe((val) => {
                    this.currContent = val[0];
                    this.thisSection = val[1];
                    setThreePartTitle(this.currContent.title, this.thisSection.title);
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
