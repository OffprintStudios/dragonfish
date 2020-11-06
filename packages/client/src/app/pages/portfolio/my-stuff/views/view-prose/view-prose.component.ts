import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ProseContent, PubStatus } from '@pulp-fiction/models/content';
import { SectionsService } from 'packages/client/src/app/services/user';
import { SectionItem } from '../../viewmodels';

@Component({
    selector: 'view-prose',
    templateUrl: './view-prose.component.html',
    styleUrls: ['./view-prose.component.less']
})
export class ViewProseComponent implements OnInit {
    myProse: ProseContent;
    mySections: SectionItem[];
    pubStatus = PubStatus;
    loadingSections = false;

    sectionForm = new FormGroup({
        title: new FormControl(''),
        body: new FormControl('')
    })

    constructor(private sectionsService: SectionsService, public route: ActivatedRoute, private location: Location) {}

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
            this.mySections = sections as SectionItem[];
            this.loadingSections = false;
        });
    }
}