import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentKind, PoetryContent, SectionInfo } from '@pulp-fiction/models/content';
import { ContentService } from '../services/content';

@Injectable()
export class ViewPoetryResolver implements Resolve<PoetryContent> {
    constructor (private contentService: ContentService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PoetryContent> {
        const poetryId = route.paramMap.get('poetryId');

        return this.contentService.fetchOnePublished(poetryId, ContentKind.PoetryContent).pipe(map(poetry => {
            const theseSections = poetry.sections as SectionInfo[];
            this.contentService.publishedSections = theseSections.filter(x => {return x.published === true});

            return poetry;
        }));
    }
}