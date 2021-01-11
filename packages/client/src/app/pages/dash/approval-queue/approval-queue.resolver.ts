import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@pulp-fiction/models/util';
import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { ApprovalQueueService } from './approval-queue.service';

@Injectable()
export class ApprovalQueueResolver implements Resolve<PaginateResult<ApprovalQueue>> {
    pageNum: number = 1;

    constructor (private queueService: ApprovalQueueService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<ApprovalQueue>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }
        
        return this.queueService.getQueue(this.pageNum);
    }
}