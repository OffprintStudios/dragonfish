import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PortfolioService } from '../services/content';
import { FrontendUser } from '@dragonfish/models/users';

@Injectable()
export class PortfolioResolver implements Resolve<FrontendUser> {
    constructor (private portService: PortfolioService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<FrontendUser> {
        const userId = route.paramMap.get('id');
        return this.portService.getUserInfo(userId);
    }
}