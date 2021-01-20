import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AQNamespace } from './approval-queue.actions';
import { ApprovalQueueStateModel } from './approval-queue-state.model';
import { ApprovalQueueService } from './services';
import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { PaginateResult } from '@pulp-fiction/models/util';
import { UserState } from '../../user';
import { FrontendUser } from '@pulp-fiction/models/users';

@State<ApprovalQueueStateModel>({
    name: 'approval_queue',
    defaults: {
        claimedDocs: [],
        selectedDoc: null
    }
})
@Injectable()
export class ApprovalQueueState {
    constructor (private queueService: ApprovalQueueService, private snackBar: MatSnackBar, private store: Store) {}

    /* Actions */

    @Action(AQNamespace.GetQueue)
    getQueue({ patchState }: StateContext<ApprovalQueueStateModel>, { pageNum }: AQNamespace.GetQueue): Observable<PaginateResult<ApprovalQueue>> {
        return this.queueService.getQueue(pageNum).pipe(tap((result: PaginateResult<ApprovalQueue>) => {
            const currUser: FrontendUser | null = this.store.selectSnapshot(UserState.currUser);
            if (currUser !== null) {
                // current behavior will reset the `claimedDocs` every time the page changes; this will be addressed 
                // in a future update to determine if docs have already been added to the array
                const ownedDocs = result.docs.filter((doc: any) => { return doc.claimedBy._id === currUser._id });
                patchState({
                    claimedDocs: ownedDocs
                });
            } else {
                this.snackBar.open(`Action forbidden.`);
            }
        }));
    }

    @Action(AQNamespace.GetQueueForMod)
    getQueueForMod(_ctx: StateContext<ApprovalQueueStateModel>, _action: AQNamespace.GetQueueForMod) {
        this.snackBar.open(`Action not yet supported.`);
    }

    @Action(AQNamespace.ClaimWork)
    claimWork({ setState }: StateContext<ApprovalQueueStateModel>, { doc }: AQNamespace.ClaimWork): Observable<ApprovalQueue> {
        return this.queueService.claimWork(doc._id).pipe(tap((result: ApprovalQueue) => {
            setState(patch({
                claimedDocs: append([result])
            }));
        }));
    }

    @Action(AQNamespace.SelectWork)
    selectWork({ patchState }: StateContext<ApprovalQueueStateModel>, { doc }: AQNamespace.SelectWork): void {
        patchState({
            selectedDoc: doc
        });
    }

    @Action(AQNamespace.ApproveWork)
    approveWork({ setState }: StateContext<ApprovalQueueStateModel>, { decision }: AQNamespace.ApproveWork) {
        return this.queueService.approveWork(decision).pipe(tap((_result: void) => {
            setState(patch({
                claimedDocs: removeItem<ApprovalQueue>(doc => doc._id === decision.docId)
            }));
        }));
    }

    @Action(AQNamespace.RejectWork)
    rejectWork({ setState }: StateContext<ApprovalQueueStateModel>, { decision }: AQNamespace.RejectWork) {
        return this.queueService.rejectWork(decision).pipe(tap((_result: void) => {
            setState(patch({
                claimedDocs: removeItem<ApprovalQueue>(doc => doc._id === decision.docId)
            }));
        }));
    }

    @Action(AQNamespace.ViewContent)
    viewContent() {
        this.snackBar.open(`Action not yet supported.`);
    }

    /* Selectors */

    @Selector()
    static claimedDocs (state: ApprovalQueueStateModel): ApprovalQueue[] {
        return state.claimedDocs;
    }
}