import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@pulp-fiction/models/util';
import { Blog } from '@pulp-fiction/models/blogs';
import { PortfolioService } from '../services/content';

@Injectable()
export class PortBlogsResolver implements Resolve<PaginateResult<Blog>> {
    pageNum: number = 1;

    constructor (private portService: PortfolioService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<Blog>> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.portService.getBlogList(userId, this.pageNum);
    }
}