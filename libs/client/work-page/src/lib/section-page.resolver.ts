import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SectionsService } from '@dragonfish/client/repository/work-page/sections';

@Injectable()
export class SectionPageResolver implements Resolve<void> {
    constructor(private sectionsService: SectionsService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const sectionId = route.paramMap.get('sectionId');

        return this.sectionsService.setActive(sectionId);
    }
}
