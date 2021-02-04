import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ContentKind } from '@dragonfish/models/content';
import { MarkReadRequest } from '@dragonfish/models/notifications';
import { NotificationsService } from '../../../services/user';
import { NotificationSelect } from './notification-select.model';

@Component({
    selector: 'sidenav-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.less'],
})
export class NotificationsComponent implements OnInit {
    loading: boolean = false;

    unread: NotificationSelect[];
    read: NotificationSelect[];
    unreadTotal = 0;
    parentKind = ContentKind;

    selectedNotifs: string[] = [];

    viewRead = false;

    constructor(private notif: NotificationsService, private snackBar: MatSnackBar) {
        this.fetchData();
    }

    ngOnInit(): void {}

    switchView(): void {
        if (this.viewRead === true) {
            this.viewRead = false;
        } else {
            this.viewRead = true;
        }
    }

    /**
     * Fetches a user's unread notifications.
     */
    public fetchData(): void {
        this.loading = true;
        this.notif.getAllNotifications().subscribe((data) => {
            this.unread = data.filter((val) => {
                return val.read !== true;
            }) as NotificationSelect[];
            this.unreadTotal = this.unread.length;
            this.read = data.filter((val) => {
                return val.read === true;
            }) as NotificationSelect[];
            this.loading = false;
        });
    }

    selectNotif(notifId: string): void {
        this.selectedNotifs.push(notifId);
    }

    deselectNotif(notifId: string): void {
        this.selectedNotifs = this.selectedNotifs.filter((val) => {
            return val !== notifId;
        });
    }

    markAsRead(): void {
        const request: MarkReadRequest = {
            ids: this.selectedNotifs,
        };

        this.notif.markAsRead(request).subscribe(
            () => {
                this.selectedNotifs = [];
                this.fetchData();
            },
            (_err) => {
                this.snackBar.open(`Something went wrong with your request! Try again in a little bit.`);
            },
        );
    }
}
