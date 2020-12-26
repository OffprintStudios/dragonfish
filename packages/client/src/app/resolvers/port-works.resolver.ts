import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentKind, PoetryContent, ProseContent } from '@pulp-fiction/models/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PortWorks } from '../models/site';
import { ContentService } from '../services/content';

@Injectable()
export class PortWorksResolver implements Resolve<PortWorks> {
    currentUser: FrontendUser;
    pageNum: number = 1;

    constructor (private contentService: ContentService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PortWorks> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        const proseList = this.contentService.fetchAllPublished(this.pageNum, [ContentKind.ProseContent], userId);
        const poetryList = this.contentService.fetchAllPublished(this.pageNum, [ContentKind.PoetryContent], userId);

        return zip(proseList, poetryList).pipe(map(value => {
            const portWorks: PortWorks = {
                prose: value[0] as PaginateResult<ProseContent>,
                poetry: value[1] as PaginateResult<PoetryContent>
            };

            return portWorks;
        }));
    }
}