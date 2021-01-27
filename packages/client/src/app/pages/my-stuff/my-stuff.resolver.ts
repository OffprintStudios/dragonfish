import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MyStuffState } from '../../shared/my-stuff';

@Injectable()
export class MyStuffResolver implements Resolve<void> {
    constructor (private stuff: MyStuffState) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<void> {
        return this.stuff.setFiles();
    }
}