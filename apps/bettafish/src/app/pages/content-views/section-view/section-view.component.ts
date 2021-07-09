import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { slugify } from 'voca';
import { Section, AuthorsNotePos } from '@dragonfish/shared/models/sections';
import { SectionInfo } from '@dragonfish/shared/models/content';
import { setThreePartTitle } from '@dragonfish/shared/constants';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';

@Component({
    selector: 'dragonfish-section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.scss'],
})
export class SectionViewComponent implements OnInit {
    sections: SectionInfo[];
    thisSection: Section;
    loading = false;

    currIndex: number;
    indexNext: number;
    indexPrev: number;

    authorsNotePosOptions = AuthorsNotePos;

    constructor(
        private viewService: ContentViewService,
        public viewQuery: ContentViewQuery,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchData();
    }

    private fetchData() {
        this.route.paramMap.subscribe((params) => {
            this.loading = true;

            this.sections = this.viewQuery.allSections;
            this.currIndex = +params.get('sectionNum') - 1;
            this.indexNext = this.currIndex + 1;
            this.indexPrev = this.currIndex - 1;

            this.viewService.fetchSection(this.sections[this.currIndex]._id).subscribe(val => {
                this.loading = false;
                this.thisSection = val;
                setThreePartTitle(this.viewQuery.contentTitle, this.thisSection.title);
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
