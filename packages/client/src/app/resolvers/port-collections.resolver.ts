import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PortCollections } from '../models/site';
import { PortfolioService } from '../services/content';

@Injectable()
export class PortCollectionsResolver implements Resolve<PortCollections> {
    pageNum: number = 1;

    constructor (private portService: PortfolioService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PortCollections> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        const blogList = this.portService.getCollectionsList(userId, this.pageNum);

        return zip(blogList, of(userId)).pipe(map(value => {
            const portBlogs: PortCollections = {
                collections: value[0],
                userId: value[1]
            };

            return portBlogs;
        }));
    }
}