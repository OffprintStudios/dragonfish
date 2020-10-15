import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NewsContentModel } from '@pulp-fiction/models/content';
import { NewsService } from '../services/content';

@Injectable()
export class NewsPageResolver implements Resolve<NewsContentModel> {
    constructor (private newsService: NewsService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<NewsContentModel> {
        const postId = route.paramMap.get('postId');
        return this.newsService.getNewsPost(postId);
    }
}