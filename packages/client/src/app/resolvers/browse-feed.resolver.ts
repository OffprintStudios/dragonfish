import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@pulp-fiction/models/util';
import { ContentService } from '../services/content';
import { ContentKind, ContentModel } from '@pulp-fiction/models/content';

@Injectable()
export class BrowseFeedResolver implements Resolve<PaginateResult<ContentModel>> {
    pageNum: number = 1;

    constructor(private contentService: ContentService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<ContentModel>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.contentService.fetchAllPublished(this.pageNum, [ContentKind.PoetryContent, ContentKind.ProseContent], null);
    }
}