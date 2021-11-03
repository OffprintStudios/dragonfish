import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PubContent } from '@dragonfish/shared/models/content';
import { WorkPageService } from '@dragonfish/client/repository/work-page';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { NotificationsRepository } from '@dragonfish/client/repository/notifications';

@Injectable()
export class WorkPageResolver implements Resolve<Observable<PubContent>> {
    constructor(
        private workPage: WorkPageService,
        private profiles: PseudonymsQuery,
        private notifications: NotificationsRepository,
    ) {}

    resolve(route: ActivatedRouteSnapshot) {
        const contentId = route.paramMap.get('id');

        if (this.profiles.current) {
            this.notifications.markUpdatedAsRead(contentId).subscribe();
        }

        return this.workPage.fetchContent(contentId);
    }
}
