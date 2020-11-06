import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProseContent, PubStatus } from '@pulp-fiction/models/content';
import { SectionsService } from 'packages/client/src/app/services/user';
import { Section } from '@pulp-fiction/models/sections';

@Component({
    selector: 'view-prose',
    templateUrl: './view-prose.component.html',
    styleUrls: ['./view-prose.component.less']
})
export class ViewProseComponent implements OnInit {
    myProse: ProseContent;
    mySections: Section[];
    pubStatus = PubStatus;
    loadingSections = false;

    constructor(private sectionsService: SectionsService, private route: ActivatedRoute, private location: Location) {}

    ngOnInit(): void {
        this.myProse = this.route.snapshot.data.proseData as ProseContent;
        this.fetchData();
    }

    goBack() {
        this.location.back();
    }

    private fetchData() {
        this.loadingSections = true;
        this.sectionsService.fetchUserContentSections(this.myProse._id).subscribe(sections => {
            this.mySections = sections;
            this.loadingSections = false;
        });
    }
}