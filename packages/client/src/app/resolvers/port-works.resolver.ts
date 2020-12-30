import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentKind, ContentModel } from '@pulp-fiction/models/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Observable } from 'rxjs';

import { PortWorks } from '../models/site';
import { ContentService } from '../services/content';

@Injectable()
export class PortWorksResolver implements Resolve<PaginateResult<ContentModel>> {
    currentUser: FrontendUser;
    pageNum: number = 1;

    constructor (private contentService: ContentService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<ContentModel>> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.contentService.fetchAllPublished(this.pageNum, [ContentKind.PoetryContent, ContentKind.ProseContent], userId);
    }
}