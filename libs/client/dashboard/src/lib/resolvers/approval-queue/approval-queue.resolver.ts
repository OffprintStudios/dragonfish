import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { ApprovalQueueService } from '@dragonfish/client/repository/dashboard/approval-queue';

@Injectable()
export class ApprovalQueueResolver implements Resolve<PaginateResult<ApprovalQueue>> {
    pageNum = 1;

    constructor(private queueService: ApprovalQueueService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        routerState: RouterStateSnapshot,
    ): Observable<PaginateResult<ApprovalQueue>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.queueService.getQueue(this.pageNum);
    }
}
