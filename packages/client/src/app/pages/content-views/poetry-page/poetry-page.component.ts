import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoetryContent, SectionInfo, PoetryForm } from '@pulp-fiction/models/content';

@Component({
    selector: 'poetry-page',
    templateUrl: './poetry-page.component.html',
    styleUrls: ['./poetry-page.component.less']
})
export class PoetryPageComponent implements OnInit {
    currPoetry: PoetryContent;
    pageNum = 1;

    poetryForm = PoetryForm;

    constructor(public route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.currPoetry = data.poetryData as PoetryContent;
            const sections = this.currPoetry.sections as SectionInfo[];
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