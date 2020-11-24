import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ContentKind, ProseContent } from '@pulp-fiction/models/content';
import { ContentService } from '../services/content';

@Injectable()
export class ViewProseResolver implements Resolve<ProseContent> {
    constructor (private contentService: ContentService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ProseContent> {
        const proseId = route.paramMap.get('proseId');

        return this.contentService.fetchOnePublished(proseId, ContentKind.ProseContent) as Observable<ProseContent>;
    }
}