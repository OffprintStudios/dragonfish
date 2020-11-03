import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProseContent } from '@pulp-fiction/models/content';

@Component({
    selector: 'view-prose',
    templateUrl: './view-prose.component.html',
    styleUrls: ['./view-prose.component.less']
})
export class ViewProseComponent implements OnInit {
    myProse: ProseContent;

    constructor(private route: ActivatedRoute, private location: Location) {}

    ngOnInit(): void {
        this.myProse = this.route.snapshot.data.proseData as ProseContent;
    }

    goBack() {
        this.location.back();
    }
}