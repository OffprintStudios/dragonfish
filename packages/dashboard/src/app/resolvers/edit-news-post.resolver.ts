import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NewsContentModel } from '@pulp-fiction/models/content'
import { PaginateResult } from '@pulp-fiction/models/util';
import { NewsService } from '../services/contrib/news';

@Injectable()
export class EditNewsPostResolver implements Resolve<NewsContentModel> {
    constructor(private newsService: NewsService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        const postId = route.paramMap.get('postId');
        return this.newsService.fetchForEdit(postId);
    }
}