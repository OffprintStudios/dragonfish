import { Injectable } from '@angular/core';
import { StoreConfig, EntityStore } from '@datorama/akita';
import { NotificationsState } from './notifications.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'notifications', idKey: '_id' })
export class NotificationsStore extends EntityStore<NotificationsState> {
    constructor() {
        super();
    }
}
