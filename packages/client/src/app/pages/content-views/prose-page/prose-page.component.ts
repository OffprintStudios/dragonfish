import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProseContent, SectionInfo } from '@pulp-fiction/models/content';
import { ContentService } from '../../../services/content';

@Component({
    selector: 'prose-page',
    templateUrl: './prose-page.component.html',
    styleUrls: ['./prose-page.component.less']
})
export class ProsePageComponent implements OnInit {
    currProse: ProseContent;
    pageNum = 1;

    constructor(public route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.currProse = data.proseData as ProseContent;
            const sections = this.currProse.sections as SectionInfo[];
        });
    }

    
    /**
     * Changes query params to the appropriate page.
     * @param event The page changed to
     */
    onPageChange(event: number) {
        if (event !== 1) {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
        } else {
        this.router.navigate([], {relativeTo: this.route});
        }
    }
}