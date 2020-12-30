import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ContentKind, ProseContent, SectionInfo } from '@pulp-fiction/models/content';
import { ContentService, HistoryService } from '../services/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../services/auth';
import { ContentPage } from '../models/site';

@Injectable()
export class ViewProseResolver implements Resolve<ContentPage> {
    currentUser: FrontendUser;

    constructor (private contentService: ContentService, private auth: AuthService, private hist: HistoryService) {
        this.auth.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ContentPage> {
        const proseId = route.paramMap.get('proseId');

        const thisProse = this.contentService.fetchOnePublished(proseId, ContentKind.ProseContent).pipe(map(prose => {
            const theseSections = prose.sections as SectionInfo[];
            this.contentService.publishedSections = theseSections.filter(x => {return x.published === true});

            return prose;
        }));

        if (this.currentUser) {
            const thisHistory = this.hist.addOrUpdateHistory(proseId);

            return zip(thisProse, thisHistory).pipe(map(val => {
                const contentPage: ContentPage = {
                    content: val[0],
                    history: val[1]
                };
                return contentPage;
            }));
        } else {
            return zip(thisProse, of(null)).pipe(map(val => {
                const contentPage: ContentPage = {
                    content: val[0],
                    history: val[1]
                };
                return contentPage;
            }));
        }
    }
}