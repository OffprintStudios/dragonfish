import { Component } from '@angular/core';
import { NotificationsQuery, NotificationsService } from '@dragonfish/client/repository/notifications';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { ContentKind } from '@dragonfish/shared/models/content';
import { slugify } from 'voca';

@Component({
    selector: 'dragonfish-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notification-list.component.scss'],
})
export class NotificationsListComponent {
    kind = NotificationKind;

    constructor(public notifications: NotificationsQuery, public notificationsService: NotificationsService) {}

    markAsRead() {
        this.notificationsService.markAsRead().subscribe();
    }

    addToActive(id: string) {
        this.notificationsService.addToActive(id);
    }

    removeFromActive(id: string) {
        this.notificationsService.removeFromActive(id);
    }

    createProfileLink(commentInfo) {
        return ['/profile', commentInfo.posterId, commentInfo.posterTag];
    }

    createContentLink(contentInfo, commentInfo) {
        switch (contentInfo.contentKind as ContentKind) {
            case ContentKind.BlogContent:
                return [
                    '/profile',
                    commentInfo.posterId,
                    commentInfo.posterTag,
                    'post',
                    contentInfo.contentId,
                    slugify(contentInfo.contentTitle),
                ];
            case ContentKind.PoetryContent:
                return ['/poetry', contentInfo.contentId, slugify(contentInfo.contentTitle)];
            case ContentKind.ProseContent:
                return ['/prose', contentInfo.contentId, slugify(contentInfo.contentTitle)];
            default:
                return [];
        }
    }
}
