import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProseContent } from '@pulp-fiction/models/content';

@Component({
    selector: 'view-prose',
    templateUrl: './view-prose.component.html',
    styleUrls: ['./view-prose.component.less']
})
export class ViewProseComponent implements OnInit {
    myProse: ProseContent;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.myProse = this.route.snapshot.data.proseData as ProseContent;
    }
}