import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@dragonfish/models/util';
import { NewsManagementService } from './news-management.service';
import { NewsContentModel } from '@dragonfish/models/content';

@Injectable()
export class NewsManagementResolver implements Resolve<PaginateResult<NewsContentModel>> {
    pageNum: number = 1;

    constructor (private newsService: NewsManagementService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<NewsContentModel>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }
        
        return this.newsService.fetchAll(this.pageNum);
    }
}