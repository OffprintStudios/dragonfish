import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { FrontendUser } from '@pulp-fiction/models/users';
import { WorkPageData } from '../models/site';
import { AuthService } from '../services/auth';
import { HistoryService, LocalSectionsService, WorksService } from '../services/content';

@Injectable()
export class WorkPageResolver implements Resolve<WorkPageData> {
    currentUser: FrontendUser;

    constructor (private authService: AuthService, private worksService: WorksService, private sectionsService: LocalSectionsService,
        private histService: HistoryService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<WorkPageData> {
        const workId = route.paramMap.get('workId');
        const workObservable = this.worksService.fetchWork(workId).pipe(map(work => {
            const pubSections = work.sections.filter(section => { return section.published === true; }); 
            if (this.currentUser) {
                if (this.currentUser._id === work.author._id) {
                    this.sectionsService.setInfo(pubSections, work.author._id, work.sections);
                  }  else {
                    this.sectionsService.setInfo(pubSections, work.author._id);
                  }
            } else {
                this.sectionsService.setInfo(pubSections, work.author._id);
            }
            return work;
        }));

        if (this.currentUser) {
            const historyObservable = this.histService.addOrUpdateHistory(workId);

            return zip(workObservable, historyObservable).pipe(map(value => {
                const pageData: WorkPageData = {
                    work: value[0],
                    history: value[1]
                };
    
                return pageData;
            }));
        } else {
            return zip(workObservable, of(null)).pipe(map(value => {
                const pageData: WorkPageData = {
                    work: value[0],
                    history: value[1]
                };
    
                return pageData;
            }));
        }
    }
}