import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Work } from '@pulp-fiction/models/works';
import { AuthService } from '../services/auth';
import { LocalSectionsService, WorksService } from '../services/content';

@Injectable()
export class WorkPageResolver implements Resolve<Work> {
    currentUser: FrontendUser;

    constructor (private authService: AuthService, private worksService: WorksService, private sectionsService: LocalSectionsService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Work> {
        const workId = route.paramMap.get('workId');
        return this.worksService.fetchWork(workId).pipe(map(work => {
            const pubSections = work.sections.filter(section => { return section.published === true; });      
            if (this.currentUser._id === work.author._id) {
              this.sectionsService.setInfo(pubSections, work.author._id, work.sections);
            }  else {
              this.sectionsService.setInfo(pubSections, work.author._id);
            }
            return work;
        }));
    }
}