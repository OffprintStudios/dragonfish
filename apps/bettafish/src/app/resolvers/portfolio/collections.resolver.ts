import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { Collection } from '@dragonfish/shared/models/collections';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Injectable()
export class CollectionsResolver implements Resolve<PaginateResult<Collection>> {
    pageNum = 1;

    constructor(private networkService: DragonfishNetworkService, private sessionQuery: SessionQuery) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<Collection>> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        if (this.sessionQuery.currentUser) {
            if (this.sessionQuery.currentUser._id === userId) {
                return this.networkService.fetchAllCollections(this.pageNum);
            } else {
                return this.networkService.fetchPublicCollections(userId, this.pageNum);
            }
        } else {
            return this.networkService.fetchPublicCollections(userId, this.pageNum);
        }
    }
}
