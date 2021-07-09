import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApprovalQueueQuery } from '@dragonfish/client/repository/dashboard/approval-queue';

@Component({
    selector: 'dragonfish-approve-poetry',
    templateUrl: './approve-poetry.component.html',
    styleUrls: ['./approve-poetry.component.scss'],
})
export class ApprovePoetryComponent {
    constructor(public route: ActivatedRoute, public queueQuery: ApprovalQueueQuery) {}
}
