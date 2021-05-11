import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import * as Portfolio from '@dragonfish/client/repository/portfolio';
import { FrontendUser } from '@dragonfish/shared/models/users';

@Injectable()
export class PortfolioResolver implements Resolve<FrontendUser> {
    constructor(private store: Store) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<FrontendUser> {
        const userId = route.paramMap.get('id');
        return this.store.dispatch(new Portfolio.FetchCurrentPortfolio(userId));
    }
}
