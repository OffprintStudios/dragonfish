import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@pulp-fiction/models/util';
import { Collection } from '@pulp-fiction/models/collections';
import { CollectionsService } from '../services/content';

@Injectable()
export class MyCollectionsResolver implements Resolve<PaginateResult<Collection>> {
    pageNum: number = 1;

    constructor (private collsService: CollectionsService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<Collection>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.collsService.fetchUserCollections(this.pageNum);
    }
}