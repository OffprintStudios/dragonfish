import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaginateResult } from '@dragonfish/models/util';
import { Work } from '@dragonfish/models/works';
import { WorksService } from '../services/content';

@Injectable()
export class MyWorksResolver implements Resolve<PaginateResult<Work>> {
    pageNum: number = 1;

    constructor (private worksService: WorksService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<Work>> {
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        return this.worksService.fetchUserWorks(this.pageNum);
    }
}