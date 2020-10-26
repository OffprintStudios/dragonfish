import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ContentModel } from '@pulp-fiction/models/content';
import { MyStuffService } from '../services/user';

@Injectable()
export class ViewContentResolver implements Resolve<ContentModel[]> {
    constructor (private stuffService: MyStuffService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ContentModel[]> {
        return this.stuffService.fetchAll();
    }
}