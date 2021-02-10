import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ApprovalQueueState } from '../shared/approval-queue';

import { ApprovalQueue } from '@dragonfish/models/approval-queue';

@Injectable()
export class ApproveContentResolver implements Resolve<ApprovalQueue> {
    constructor(private store: Store) {}

    resolve(_route: ActivatedRouteSnapshot, _routerState: RouterStateSnapshot): Observable<ApprovalQueue> {
        return this.store.selectOnce<ApprovalQueue>(ApprovalQueueState.selectedDoc);
    }
}
