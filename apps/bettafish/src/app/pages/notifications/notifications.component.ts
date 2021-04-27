import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationSelectModel } from './notification-select.model';
import { ContentKind } from '@dragonfish/shared/models/content';
import { AlertsService } from '@dragonfish/client/alerts';
import { MarkReadRequest } from '@dragonfish/shared/models/notifications';
import { NotificationsService } from '../../services';

@Component({
    selector: 'dragonfish-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
    loading = false;
    unread: NotificationSelectModel[];
    read: NotificationSelectModel[];
    unreadTotal = 0;
    parentKind = ContentKind;
    selectedNotifications: string[] = [];
    viewRead = false;

    constructor(private alerts: AlertsService, private notifications: NotificationsService) {}

    switchView(): void {
        this.viewRead = !this.viewRead;
    }

    /**
     * Fetches a user's unread notifications.
     */
    public fetchData(): void {
        this.loading = true;
        this.notifications.getAllNotifications().subscribe((data) => {
            this.unread = data.filter((val) => {
                return val.read !== true;
            }) as NotificationSelectModel[];
            this.unreadTotal = this.unread.length;
            this.read = data.filter((val) => {
                return val.read === true;
            }) as NotificationSelectModel[];
            this.loading = false;
        });
    }

    selectNotification(notificationId: string): void {
        this.selectedNotifications.push(notificationId);
    }

    deselectNotification(notificationId: string): void {
        this.selectedNotifications = this.selectedNotifications.filter((val) => {
            return val !== notificationId;
        });
    }

    markAsRead(): void {
        const request: MarkReadRequest = {
            ids: this.selectedNotifications,
        };

        this.notifications.markAsRead(request).subscribe(
            () => {
                this.selectedNotifications = [];
                this.fetchData();
            },
            (_err) => {
                this.alerts.error(`Something went wrong with your request! Try again in a little bit.`);
            },
        );
    }
}
