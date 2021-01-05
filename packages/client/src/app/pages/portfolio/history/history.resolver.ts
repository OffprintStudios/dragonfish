import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@pulp-fiction/models/util';
import { HistoryService } from '../../../services/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';

@Injectable()
export class HistoryResolver implements Resolve<PaginateResult<ReadingHistory>> {
    pageNum: number = 1;

    constructor (private hist: HistoryService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<ReadingHistory>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.hist.fetchUserHistory(this.pageNum);
    }
}