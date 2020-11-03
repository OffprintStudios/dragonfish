import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PoetryContent, PubStatus } from '@pulp-fiction/models/content';

@Component({
    selector: 'view-poetry',
    templateUrl: './view-poetry.component.html',
    styleUrls: ['./view-poetry.component.less']
})
export class ViewPoetryComponent implements OnInit {
    myPoetry: PoetryContent;

    pubStatus = PubStatus;

    constructor(private route: ActivatedRoute, private location: Location) {}

    ngOnInit(): void {
        this.myPoetry = this.route.snapshot.data.poetryData as PoetryContent;
    }

    goBack() {
        this.location.back();
    }
}