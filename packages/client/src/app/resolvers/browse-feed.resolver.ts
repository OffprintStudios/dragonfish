import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@pulp-fiction/models/util';
import { Work } from '@pulp-fiction/models/works';
import { BrowseService } from '../services/content';

@Injectable()
export class BrowseFeedResolver implements Resolve<PaginateResult<Work>> {
    pageNum: number = 1;

    constructor (private browseService: BrowseService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<Work>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.browseService.fetchAllPublishedWorks(this.pageNum);
    }
}