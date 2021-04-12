import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ApprovalQueueState } from '../../../shared/approval-queue';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';

@Component({
    selector: 'dragonfish-approval-queue-toolbar',
    templateUrl: './approval-queue-toolbar.component.html',
    styleUrls: ['./approval-queue-toolbar.component.scss']
})
export class ApprovalQueueToolbarComponent {
    @Select(ApprovalQueueState.selectedDoc) selectedDoc$: Observable<ApprovalQueue>;

    constructor(private location: Location) {}

    forceRefresh() {
        // more stuff
    }

    goBack() {
        this.location.back();
    }

    approveWork(doc: ApprovalQueue) {
        // things
    }

    rejectWork(doc: ApprovalQueue) {
        // stuff
    }
}
