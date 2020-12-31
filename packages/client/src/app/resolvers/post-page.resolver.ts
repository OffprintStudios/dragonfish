import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentPage } from '../models/site';
import { HistoryService, NewsService } from '../services/content';
import { AuthService } from '../services/auth';
import { FrontendUser } from '@pulp-fiction/models/users';

@Injectable()
export class PostPageResolver implements Resolve<ContentPage> {
    currentUser: FrontendUser;

    constructor (private newsService: NewsService, private auth: AuthService, private hist: HistoryService) {
        this.auth.currUser.subscribe(x => {
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