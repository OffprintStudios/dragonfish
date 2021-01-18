import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { AuthState } from '../shared/auth';

import { ContentPage } from '../models/site';
import { HistoryService, NewsService } from '../services/content';
import { FrontendUser } from '@pulp-fiction/models/users';

@Injectable()
export class PostPageResolver implements Resolve<ContentPage> {
    @Select(AuthState.user) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    constructor (private newsService: NewsService, private hist: HistoryService) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ContentPage> {
        const postId = route.paramMap.get('postId');
        const thisPost = this.newsService.getNewsPost(postId);

        if (this.currentUser) {
            const thisHistory = this.hist.addOrUpdateHistory(postId);
            return zip(thisPost, thisHistory).pipe(map(val => {
                const contentPage: ContentPage = {
                    content: val[0],
                    history: val[1]
                };
                return contentPage;
            }));
        } else {
            return zip(thisPost, of(null)).pipe(map(val => {
                const contentPage: ContentPage = {
                    content: val[0],
                    history: val[1]
                };
                return contentPage;
            }));
        }
    }
}