import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ContentKind, ContentModel } from '@dragonfish/models/content';

import { NetworkService } from '../services';

@Injectable()
export class ViewContentResolver implements Resolve<ContentModel> {
    constructor(private networkService: NetworkService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ContentModel> {
        const contentId = route.queryParamMap.get('contentId');
        const kind = route.queryParamMap.get('kind') as ContentKind;

        return this.networkService.fetchOneMyStuff(contentId, kind);
    }
}
