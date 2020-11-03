import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoetryContent } from '@pulp-fiction/models/content';

@Component({
    selector: 'view-poetry',
    templateUrl: './view-poetry.component.html',
    styleUrls: ['./view-poetry.component.less']
})
export class ViewPoetryComponent implements OnInit {
    myPoetry: PoetryContent;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.myPoetry = this.route.snapshot.data.poetryData as PoetryContent;
    }
}