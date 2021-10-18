import { Component } from '@angular/core';
import { NotificationsQuery } from '@dragonfish/client/repository/notifications';

@Component({
    selector: 'dragonfish-notifications-list',
    templateUrl: './notifications-list.component.html',
})
export class NotificationsListComponent {
    constructor(public notifications: NotificationsQuery) {}
}
