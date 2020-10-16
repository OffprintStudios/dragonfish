import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PortWorks } from '../models/site';
import { PortfolioService } from '../services/content';

@Injectable()
export class PortWorksResolver implements Resolve<PortWorks> {
    pageNum: number = 1;

    constructor (private portService: PortfolioService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PortWorks> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        const worksList = this.portService.getWorksList(userId, this.pageNum);

        return zip(worksList, of(userId)).pipe(map(value => {
            const portWorks: PortWorks = {
                works: value[0],
                userId: value[1]
            };

            return portWorks;
        }));
    }
}