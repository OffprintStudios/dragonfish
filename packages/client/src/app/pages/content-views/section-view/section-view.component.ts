import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../../services/content';
import { SectionInfo } from '@pulp-fiction/models/content';
import { Section } from '@pulp-fiction/models/sections';
import { ActivatedRoute } from '@angular/router';

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

    constructor(private contentService: ContentService, private route: ActivatedRoute) {
        this.fetchData();
    }

    ngOnInit(): void {}

    private fetchData() {
        this.loading = true;
        this.route.paramMap.subscribe(params => {
            this.currIndex = +params.get('sectionNum') - 1;
            this.sections = this.contentService.publishedSections;
            this.contentService.fetchOneSection(this.sections[this.currIndex]._id).subscribe(data => {
                this.thisSection = data;
                this.loading = false;
            });
        });
    }
}