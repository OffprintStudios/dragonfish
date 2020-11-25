import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProseContent, SectionInfo } from '@pulp-fiction/models/content';
import { ContentService } from '../../../services/content';

@Component({
    selector: 'prose-page',
    templateUrl: './prose-page.component.html',
    styleUrls: ['./prose-page.component.less']
})
export class ProsePageComponent implements OnInit {
    currProse: ProseContent;

    constructor(public route: ActivatedRoute, private contentService: ContentService) {}

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.currProse = data.proseData as ProseContent;
            const sections = this.currProse.sections as SectionInfo[];
        });
    }
}