import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../../services/content';
import { SectionInfo } from '@pulp-fiction/models/content';
import { Section } from '@pulp-fiction/models/sections';

@Component({
    selector: 'section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.less']
})
export class SectionViewComponent implements OnInit {
    sections: SectionInfo[];
    thisSection: Section;

    constructor(private contentService: ContentService) {
        this.sections = this.contentService.publishedSections;
    }

    ngOnInit(): void {}
}