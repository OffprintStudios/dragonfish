import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@dragonfish/models/util';
import { NetworkService } from '../../../services';
import { NewsContentModel } from '@dragonfish/models/content';

@Injectable()
export class NewsManagementResolver implements Resolve<PaginateResult<NewsContentModel>> {
    pageNum: number = 1;

    constructor(private networkService: NetworkService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        routerState: RouterStateSnapshot,
    ): Observable<PaginateResult<NewsContentModel>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.networkService.fetchAllNewsposts(this.pageNum);
    }
}
