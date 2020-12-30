import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, zip, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { BlogsContentModel, ContentKind } from '@pulp-fiction/models/content';
import { ContentService, HistoryService } from '../services/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../services/auth';
import { ContentPage } from '../models/site';

@Injectable()
export class BlogPageResolver implements Resolve<ContentPage> {
    currentUser: FrontendUser;

    constructor (private contentService: ContentService, private auth: AuthService, private hist: HistoryService) {
        this.auth.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ContentPage> {
        const blogId = route.paramMap.get('blogId');

        const thisBlog = this.contentService.fetchOnePublished(blogId, ContentKind.BlogContent) as Observable<BlogsContentModel>;

        if (this.currentUser) {
            const thisHistory = this.hist.addOrUpdateHistory(blogId);

            return zip(thisBlog, thisHistory).pipe(map(val => {
                const contentPage: ContentPage = {
                    content: val[0],
                    history: val[1]
                };

                return contentPage;
            }))
        } else {
            return zip(thisBlog, of(null)).pipe(map(val => {
                const contentPage: ContentPage = {
                    content: val[0],
                    history: val[1]
                };

                return contentPage;
            }));
        }
    }
}