import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BlogsContentModel, ContentKind } from '@pulp-fiction/models/content';
import { Observable, zip, of } from 'rxjs';

import { BlogsService, ContentService } from '../services/content';

@Injectable()
export class PortBlogsResolver implements Resolve<BlogsContentModel[]> {
    pageNum: number = 1;

    constructor (private contentService: ContentService, private blogsService: BlogsService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<BlogsContentModel[]> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.contentService.fetchAllPublished(this.pageNum, ContentKind.BlogContent, userId) as Observable<BlogsContentModel[]>;
    }
}