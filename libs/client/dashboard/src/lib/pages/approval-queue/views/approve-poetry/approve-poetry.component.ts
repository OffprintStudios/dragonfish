import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { PoetryContent } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-approve-poetry',
    templateUrl: './approve-poetry.component.html',
    styleUrls: ['./approve-poetry.component.scss'],
})
export class ApprovePoetryComponent implements OnInit {
    currPoetry: PoetryContent;

    constructor(public route: ActivatedRoute) {}

    ngOnInit(): void {
        this.currPoetry = cloneDeep(this.route.snapshot.data.workToApprove) as PoetryContent;
    }
}
