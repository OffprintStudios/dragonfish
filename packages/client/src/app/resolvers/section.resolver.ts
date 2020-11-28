import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Section } from '@pulp-fiction/models/sections';
import { ContentService } from '../services/content';

@Injectable()
export class SectionResolver implements Resolve<Section> {
    constructor (private contentService: ContentService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Section> {
        const sectionNum = +route.paramMap.get('sectionNum');
        return this.contentService.fetchOneSection(this.contentService.publishedSections[sectionNum - 1]._id);
    }
}