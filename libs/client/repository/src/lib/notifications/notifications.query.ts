import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { NotificationsState } from './notifications.state';
import { NotificationsStore } from './notifications.store';

@Injectable({ providedIn: 'root' })
export class NotificationsQuery extends QueryEntity<NotificationsState> {
    public all$ = this.selectAll();
    public loading$ = this.selectLoading();

    constructor(protected store: NotificationsStore) {
        super(store);
    }

    public get activeIds() {
        const active = this.getActive();
        const ids: string[] = [];
        for (const notif of active) {
            ids.push(notif._id);
        }
        return ids;
    }

    public get numNotifications() {
        return this.getCount();
    }

    public get numSelected() {
        if (this.getActive()) {
            return this.getActive().length;
        } else {
            return 0;
        }
    }
}
