import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ApprovalQueueState } from '../../../../shared/dash/approval-queue';

import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { ContentService } from 'packages/client/src/app/services/content';
import { SectionInfo } from '@pulp-fiction/models/content';

@Injectable()
export class ApproveContentResolver implements Resolve<ApprovalQueue> {
    constructor (private store: Store, private contentService: ContentService) {}

    resolve(_route: ActivatedRouteSnapshot, _routerState: RouterStateSnapshot): Observable<ApprovalQueue> {
        return this.store.selectOnce<ApprovalQueue>(ApprovalQueueState.selectedDoc).pipe(map(res => {
            console.log(res);
            const thisWork = res.workToApprove as any;
            const theseSections = thisWork.sections as SectionInfo[];

            this.contentService.publishedSections = theseSections.filter(x => { return x.published === true});
            return res;
        }));
    }
}