import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

import { MyStuff } from '../../shared/my-stuff';

@Injectable()
export class MyStuffResolver implements Resolve<void> {
    constructor (private store: Store) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<void> {
        return this.store.dispatch(new MyStuff.SetFiles());
    }
}