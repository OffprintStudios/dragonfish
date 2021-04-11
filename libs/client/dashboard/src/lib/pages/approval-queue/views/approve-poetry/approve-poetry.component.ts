import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';

import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { PoetryContent, PoetryForm } from '@dragonfish/shared/models/content';
import { WorkStatus } from '@dragonfish/shared/models/works';

@Component({
    selector: 'dragonfish-approve-poetry',
    templateUrl: './approve-poetry.component.html',
    styleUrls: ['./approve-poetry.component.scss'],
})
export class ApprovePoetryComponent implements OnInit {
    currDoc: ApprovalQueue;
    currPoetry: PoetryContent;
    contentStatus = WorkStatus;
    poetryForm = PoetryForm;

    constructor(public route: ActivatedRoute) {}

    ngOnInit(): void {
        this.currDoc = cloneDeep(this.route.snapshot.data.contentData) as ApprovalQueue;
        this.currPoetry = cloneDeep(this.currDoc.workToApprove) as PoetryContent;
    }
}
