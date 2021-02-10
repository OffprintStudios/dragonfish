import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { AQNamespace, ApprovalQueueState } from '../shared/approval-queue';
import { PaginateResult } from '@dragonfish/models/util';
import { ApprovalQueue } from '@dragonfish/models/approval-queue';

@Injectable()
export class ApprovalQueueResolver implements Resolve<PaginateResult<ApprovalQueue>> {
    pageNum: number = 1;

    constructor(private store: Store) {}

    resolve(
        route: ActivatedRouteSnapshot,
        routerState: RouterStateSnapshot,
    ): Observable<PaginateResult<ApprovalQueue>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.store.dispatch(new AQNamespace.GetQueue(this.pageNum)).pipe(
            switchMap(() => {
                return this.store.selectOnce<PaginateResult<ApprovalQueue>>(ApprovalQueueState.currPageDocs);
            }),
        );
    }
}
