import { Component } from '@angular/core';
import { NotificationsQuery, NotificationsService } from '@dragonfish/client/repository/notifications';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';

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
}
