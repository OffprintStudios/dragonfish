import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PortfolioService } from '@dragonfish/client/repository/portfolio';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Injectable()
export class PortfolioResolver implements Resolve<Pseudonym> {
    constructor(private portfolioService: PortfolioService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Pseudonym> {
        const userId = route.paramMap.get('id');
        return this.portfolioService.fetchPortfolio(userId);
    }
}
