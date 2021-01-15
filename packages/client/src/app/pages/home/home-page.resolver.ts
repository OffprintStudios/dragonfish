import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@pulp-fiction/models/util';
import { NewsContentModel } from '@pulp-fiction/models/content';
import { NewsService } from '../../services/content';

@Injectable()
export class HomePageResolver implements Resolve<PaginateResult<NewsContentModel>> {
    pageNum: number = 1;

    constructor (private newsService: NewsService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<NewsContentModel>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.newsService.getNewsFeed(this.pageNum);
    }
}