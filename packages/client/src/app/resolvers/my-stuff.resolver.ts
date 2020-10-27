import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentModel } from '@pulp-fiction/models/content';
import { MyStuff } from '../models/site';
import { MyStuffService } from '../services/user';

@Injectable()
export class MyStuffResolver implements Resolve<MyStuff> {
    constructor (private stuffService: MyStuffService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<MyStuff> {
        const content = this.stuffService.fetchAll();
        const folders = this.stuffService.fetchTopFolders();

        return zip(content, folders).pipe(map(value => {
            const stuff: MyStuff = {
                content: value[0],
                folders: value[1]
            };

            return stuff;
        }));
    }
}