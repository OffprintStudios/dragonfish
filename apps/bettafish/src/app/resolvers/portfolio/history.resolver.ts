import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@dragonfish/shared/models/util';
import { NetworkService } from '../../services';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';

@Injectable()
export class HistoryResolver implements Resolve<PaginateResult<ReadingHistory>> {
    pageNum = 1;

    constructor(private networkService: NetworkService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        routerState: RouterStateSnapshot,
    ): Observable<PaginateResult<ReadingHistory>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.networkService.fetchUserHistory(this.pageNum);
    }
}
