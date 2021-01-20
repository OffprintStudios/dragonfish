import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApprovalQueueService } from '../../approval-queue.service';
import { ProseContent, ContentKind } from '@pulp-fiction/models/content';

@Injectable()
export class ApproveProseResolver implements Resolve<ProseContent> {
    constructor (private queueService: ApprovalQueueService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<ProseContent> {
        const contentId: string = route.queryParamMap.get('contentId');
        const kind: ContentKind = route.queryParamMap.get('kind') as ContentKind;
        const userId: string = route.queryParamMap.get('userId');
        
        return this.queueService.viewContent(contentId, kind, userId) as Observable<ProseContent>;
    }
}