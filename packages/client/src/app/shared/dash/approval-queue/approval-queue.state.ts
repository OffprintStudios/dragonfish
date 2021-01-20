import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AQNamespace } from './approval-queue.actions';
import { ApprovalQueueStateModel } from './approval-queue-state.model';
import { ApprovalQueueService } from './services';
import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { PaginateResult } from '@pulp-fiction/models/util';

@State<ApprovalQueueStateModel>({
    name: 'approval_queue',
    defaults: {
        claimedDocs: []
    }
})
@Injectable()
export class ApprovalQueueState {
    constructor (private queueService: ApprovalQueueService, private snackBar: MatSnackBar) {}

    /* Actions */

    @Action(AQNamespace.GetQueue)
    getQueue(_ctx: StateContext<ApprovalQueueStateModel>, { pageNum }: AQNamespace.GetQueue): Observable<PaginateResult<ApprovalQueue>> {
        return this.queueService.getQueue(pageNum);
    }

    @Action(AQNamespace.GetQueueForMod)
    getQueueForMod(_ctx: StateContext<ApprovalQueueStateModel>, { pageNum }: AQNamespace.GetQueueForMod): Observable<PaginateResult<ApprovalQueue>> {
        return this.queueService.getQueueForMod(pageNum);
    }

    @Action(AQNamespace.ClaimWork)
    claimWork({ setState }: StateContext<ApprovalQueueStateModel>, { doc }: AQNamespace.ClaimWork): Observable<ApprovalQueue> {
        return this.queueService.claimWork(doc._id).pipe(tap((result: ApprovalQueue) => {
            setState(patch({
                claimedDocs: append([result])
            }));
        }));
    }

    @Action(AQNamespace.ApproveWork)
    approveWork({ setState }: StateContext<ApprovalQueueStateModel>, { decision }: AQNamespace.ApproveWork) {
        return this.queueService.approveWork(decision).pipe(tap((_res: void) => {
            setState(patch({
                claimedDocs: removeItem<ApprovalQueue>(doc => doc._id === decision.docId)
            }));
        }));
    }

    @Action(AQNamespace.RejectWork)
    rejectWork({ setState }: StateContext<ApprovalQueueStateModel>, { decision }: AQNamespace.RejectWork) {
        return this.queueService.rejectWork(decision).pipe(tap((_res: void) => {
            setState(patch({
                claimedDocs: removeItem<ApprovalQueue>(doc => doc._id === decision.docId)
            }));
        }));
    }

    @Action(AQNamespace.ViewContent)
    viewContent() {
        this.snackBar.open(`Action not yet supported.`);
    }
}