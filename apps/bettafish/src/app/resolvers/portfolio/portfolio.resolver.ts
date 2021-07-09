import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { PortfolioService } from '@dragonfish/client/repository/portfolio';

@Injectable()
export class PortfolioResolver implements Resolve<FrontendUser> {
    constructor(private portfolioService: PortfolioService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<FrontendUser> {
        const userId = route.paramMap.get('id');
        return this.portfolioService.fetchPortfolio(userId);
    }
}
