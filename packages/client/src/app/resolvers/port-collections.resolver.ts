import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PortCollections } from '../models/site';
import { AuthService } from '../services/auth';
import { CollectionsService, PortfolioService } from '../services/content';

@Injectable()
export class PortCollectionsResolver implements Resolve<PortCollections> {
    currentUser: FrontendUser;
    pageNum: number = 1;

    constructor (private portService: PortfolioService, private authService: AuthService, private collsService: CollectionsService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PortCollections> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        const collList = this.portService.getCollectionsList(userId, this.pageNum);

        if (this.currentUser) {
            const userCollList = this.collsService.fetchUserCollections(this.pageNum);

            return zip(collList, userCollList).pipe(map(value => {
                const portColl: PortCollections = {
                    collections: value[0],
                    userCollections: value[1]
                };
                return portColl;
            }));
        } else {
            return zip(collList, of(null)).pipe(map(value => {
                const portColl: PortCollections = {
                    collections: value[0],
                    userCollections: value[1]
                };
                return portColl;
            }));
        }
    }
}