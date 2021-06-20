import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { ApprovalQueueQuery } from '@dragonfish/client/repository/dashboard/approval-queue';

@Injectable()
export class ApproveContentResolver implements Resolve<ApprovalQueue> {
    constructor(private queueQuery: ApprovalQueueQuery) {}

    resolve(_route: ActivatedRouteSnapshot, _routerState: RouterStateSnapshot): Observable<ApprovalQueue> {
        return this.queueQuery.selected$;
    }
}
