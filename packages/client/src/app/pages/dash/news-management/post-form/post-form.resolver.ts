import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NewsContentModel } from '@dragonfish/models/content';
import { NewsManagementService } from '../news-management.service';

@Injectable()
export class PostFormResolver implements Resolve<NewsContentModel> {
    constructor(private newsService: NewsManagementService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        const postId = route.paramMap.get('postId');
        return this.newsService.fetchForEdit(postId);
    }
}
