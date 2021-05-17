import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApprovalQueueState } from '../../../../shared/approval-queue';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';

@Component({
    selector: 'dragonfish-approve-poetry',
    templateUrl: './approve-poetry.component.html',
    styleUrls: ['./approve-poetry.component.scss'],
})
export class ApprovePoetryComponent {
    @Select(ApprovalQueueState.selectedDoc) currDoc: Observable<ApprovalQueue>;

    constructor(public route: ActivatedRoute) {}
}
