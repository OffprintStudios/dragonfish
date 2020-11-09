import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ContentKind, ContentModel } from '@pulp-fiction/models/content';
import { MyStuffService } from '../services/user';

@Injectable()
export class ViewContentResolver implements Resolve<ContentModel> {
    constructor (private stuffService: MyStuffService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ContentModel> {
        const contentId = route.queryParamMap.get('contentId');
        const kind = route.queryParamMap.get('kind') as ContentKind;

        return this.stuffService.fetchOne(contentId, kind);
    }
}