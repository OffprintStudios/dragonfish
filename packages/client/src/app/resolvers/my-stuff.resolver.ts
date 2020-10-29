import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentModel } from '@pulp-fiction/models/content';
import { MyStuff } from '../models/site';
import { MyStuffService } from '../services/user';

@Injectable()
export class MyStuffResolver implements Resolve<ContentModel[]> {
    constructor (private stuffService: MyStuffService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ContentModel[]> {
        return this.stuffService.fetchAll();
    }
}