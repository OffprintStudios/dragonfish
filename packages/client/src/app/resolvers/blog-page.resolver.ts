import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { AuthState } from '../shared/auth';

import { BlogsContentModel, ContentKind } from '@pulp-fiction/models/content';
import { ContentService, HistoryService } from '../services/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { ContentPage } from '../models/site';

@Injectable()
export class BlogPageResolver implements Resolve<ContentPage> {
    @Select(AuthState.user) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    constructor (private contentService: ContentService, private hist: HistoryService) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
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