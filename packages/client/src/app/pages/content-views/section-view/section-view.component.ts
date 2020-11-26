import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../../services/content';
import { ContentModel, SectionInfo } from '@pulp-fiction/models/content';
import { Section } from '@pulp-fiction/models/sections';
import { ActivatedRoute, Router } from '@angular/router';
import * as v from 'voca';

@Component({
    selector: 'section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.less']
})
export class SectionViewComponent implements OnInit {
    sections: SectionInfo[];
    thisSection: Section;
    loading = false;

    currIndex: number;
    indexNext: number;
    indexPrev: number;

    constructor(private contentService: ContentService, private route: ActivatedRoute, private router: Router) {
        this.fetchData();
    }

    ngOnInit(): void {}

    private fetchData() {
        this.loading = true;
        this.route.paramMap.subscribe(params => {
            this.currIndex = +params.get('sectionNum') - 1;
            this.indexNext = this.currIndex + 1;
            this.indexPrev = this.currIndex - 1;
            this.sections = this.contentService.publishedSections;
            this.contentService.fetchOneSection(this.sections[this.currIndex]._id).subscribe(data => {
                this.thisSection = data;
                this.loading = false;
            });
        });
    }

    changeSection(section: SectionInfo) {
        const sectionIndex = this.sections.indexOf(section);
        this.router.navigate([`${sectionIndex + 1}/${v.slugify(section.title)}`], {relativeTo: this.route.parent})
    }
}