import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';

import { ContentModel } from '@dragonfish/shared/models/content';
import { MyStuffState } from '../repo';
import * as Sections from '../repo/sections/sections.actions';

@Injectable()
export class ViewSectionsResolver implements Resolve<void> {
    @SelectSnapshot(MyStuffState.currContent) currContent: ContentModel | null;
    constructor(private store: Store) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<void> {
        return this.store.dispatch(new Sections.SetAll(this.currContent._id));
    }
}
