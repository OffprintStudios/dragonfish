import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentKind, ProseContent, SectionInfo } from '@pulp-fiction/models/content';
import { ContentService } from '../services/content';

@Injectable()
export class ViewProseResolver implements Resolve<ProseContent> {
    constructor (private contentService: ContentService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ProseContent> {
        const proseId = route.paramMap.get('proseId');

        return this.contentService.fetchOnePublished(proseId, ContentKind.ProseContent).pipe(map(prose => {
            const theseSections = prose.sections as SectionInfo[];
            this.contentService.publishedSections = theseSections.filter(x => {return x.published === true});

            return prose;
        }));
    }
}