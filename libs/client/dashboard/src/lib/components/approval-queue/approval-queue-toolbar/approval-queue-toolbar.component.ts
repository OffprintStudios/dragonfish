import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ApprovalQueueState, AQNamespace } from '../../../shared/approval-queue';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { ContentModel } from '@dragonfish/shared/models/content';
import { Decision } from '@dragonfish/shared/models/contrib';
import { UserInfo } from '@dragonfish/shared/models/users';
import { Navigate } from '@ngxs/router-plugin';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dragonfish-approval-queue-toolbar',
    templateUrl: './approval-queue-toolbar.component.html',
    styleUrls: ['./approval-queue-toolbar.component.scss']
})
export class ApprovalQueueToolbarComponent {
    @Select(ApprovalQueueState.selectedDoc) selectedDoc$: Observable<ApprovalQueue>;
    @Input() route: ActivatedRoute;
    @Input() pageNum: number;

    constructor(private location: Location, private store: Store, private router: Router) {}

    forceRefresh() {
        // eventually, none of this will be necessary and items will be updated in-place.
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.pageNum },
            queryParamsHandling: 'merge',
        });
    }

    goBack() {
        this.location.back();
    }

    approveWork(doc: ApprovalQueue) {
        const thisWork = doc.workToApprove as ContentModel;
        const thisWorksAuthor = thisWork.author as UserInfo;
        const decision: Decision = {
            docId: doc._id,
            workId: thisWork._id,
            authorId: thisWorksAuthor._id,
        };
        this.store
            .dispatch([new AQNamespace.ApproveWork(decision), new Navigate(['/dashboard/approval-queue'])])
            .subscribe();
    }

    rejectWork(doc: ApprovalQueue) {
        const thisWork = doc.workToApprove as ContentModel;
        const thisWorksAuthor = thisWork.author as UserInfo;
        const decision: Decision = {
            docId: doc._id,
            workId: thisWork._id,
            authorId: thisWorksAuthor._id,
        };
        this.store
            .dispatch([new AQNamespace.RejectWork(decision), new Navigate(['/dashboard/approval-queue'])])
            .subscribe();
    }
}
