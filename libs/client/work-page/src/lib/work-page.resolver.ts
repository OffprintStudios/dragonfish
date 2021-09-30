import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PubContent } from '@dragonfish/shared/models/content';
import { WorkPageService } from '@dragonfish/client/repository/work-page';

@Injectable()
export class WorkPageResolver implements Resolve<Observable<PubContent>> {
    constructor(private workPage: WorkPageService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const contentId = route.paramMap.get('id');

        return this.workPage.fetchContent(contentId);
    }
}
