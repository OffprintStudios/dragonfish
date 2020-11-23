import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { BlogsContentModel, ContentKind } from '@pulp-fiction/models/content';
import { ContentService } from '../services/content';

@Injectable()
export class BlogPageResolver implements Resolve<BlogsContentModel> {
    constructor (private contentService: ContentService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<BlogsContentModel> {
        const blogId = route.paramMap.get('blogId');
        return this.contentService.fetchOnePublished(blogId, ContentKind.BlogContent) as Observable<BlogsContentModel>;
    }
}