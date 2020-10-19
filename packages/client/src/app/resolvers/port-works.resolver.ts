import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PortWorks } from '../models/site';
import { AuthService } from '../services/auth';
import { PortfolioService, WorksService } from '../services/content';

@Injectable()
export class PortWorksResolver implements Resolve<PortWorks> {
    currentUser: FrontendUser;
    pageNum: number = 1;

    constructor (private portService: PortfolioService, private authService: AuthService, private worksService: WorksService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PortWorks> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        const worksList = this.portService.getWorksList(userId, this.pageNum);
        if (this.currentUser) {
            const userWorksList = this.worksService.fetchUserWorks(this.pageNum);

            return zip(worksList, userWorksList).pipe(map(value => {
                const portWorks: PortWorks = {
                    works: value[0],
                    userWorks: value[1]
                };
    
                return portWorks;
            }));
        } else {
            return zip(worksList, of(null)).pipe(map(value => {
                const portWorks: PortWorks = {
                    works: value[0],
                    userWorks: value[1]
                };
                return portWorks;
            }));
        }
    }
}