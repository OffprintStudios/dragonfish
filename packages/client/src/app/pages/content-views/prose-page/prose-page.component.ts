import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProseContent } from '@pulp-fiction/models/content';

@Component({
    selector: 'prose-page',
    templateUrl: './prose-page.component.html',
    styleUrls: ['./prose-page.component.less']
})
export class ProsePageComponent implements OnInit {
    currProse: ProseContent;

    constructor(public route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.currProse = data.proseData as ProseContent;
        });
    }
}