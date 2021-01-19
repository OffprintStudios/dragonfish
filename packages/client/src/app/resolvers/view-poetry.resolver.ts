import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { UserState } from '../shared/user';

import { ContentPage } from '../models/site';
import { ContentKind, SectionInfo } from '@pulp-fiction/models/content';
import { ContentService, HistoryService } from '../services/content';
import { FrontendUser } from '@pulp-fiction/models/users';

@Injectable()
export class ViewPoetryResolver implements Resolve<ContentPage> {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    constructor (private contentService: ContentService, private hist: HistoryService) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ContentPage> {
        const poetryId = route.paramMap.get('poetryId');

        const thisPoetry = this.contentService.fetchOnePublished(poetryId, ContentKind.PoetryContent).pipe(map(poetry => {
            const theseSections = poetry.sections as SectionInfo[];
            this.contentService.publishedSections = theseSections.filter(x => {return x.published === true});

            return poetry;
        }));

        if (this.currentUser) {
            const thisHistory = this.hist.addOrUpdateHistory(poetryId);

            return zip(thisPoetry, thisHistory).pipe(map(val => {
                const contentPage: ContentPage = {
                    content: val[0],
                    history: val[1]
                };
                return contentPage;
            }));
        } else {
            return zip(thisPoetry, of(null)).pipe(map(val => {
                const contentPage: ContentPage = {
                    content: val[0],
                    history: val[1]
                };
                return contentPage;
            }));
        }
    }
}