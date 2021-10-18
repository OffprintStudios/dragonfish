import { Injectable } from '@angular/core';
import { NotificationsStore } from './notifications.store';
import { NotificationsQuery } from './notifications.query';
import { AlertsService } from '@dragonfish/client/alerts';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    constructor(
        private store: NotificationsStore,
        private query: NotificationsQuery,
        private alerts: AlertsService,
        private network: DragonfishNetworkService,
        private pseuds: PseudonymsQuery,
    ) {}

    public getAllUnread() {
        return this.network.fetchAllUnread(this.pseuds.currentId).pipe(
            tap((data) => {
                this.store.set(data);
            }),
        );
    }

    public addToActive(id: string) {
        if (this.query.getActive()) {
            this.store.addActive(id);
        } else {
            this.store.setActive([id]);
        }
    }

    public removeFromActive(id: string) {
        this.store.removeActive(id);
    }

    public isActive(id: string) {
        return this.query.hasActive(id);
    }

    public markAsRead() {
        return this.network.markNotificationsAsRead(this.pseuds.currentId, { ids: this.query.activeIds }).pipe(
            tap(() => {
                this.store.removeActive(this.query.activeIds);
                this.store.remove(this.query.activeIds);
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong! Try again in a little bit.`);
                return throwError(err);
            }),
        );
    }
}
