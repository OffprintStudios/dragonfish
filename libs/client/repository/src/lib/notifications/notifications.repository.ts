import { Injectable } from '@angular/core';
import { createState, select, Store, withProps } from '@ngneat/elf';
import {
    addActiveIds,
    getActiveIds,
    removeActiveIds,
    selectAll,
    setEntities,
    withActiveIds,
    withEntities,
} from '@ngneat/elf-entities';
import { Notification, NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { ContentUpdatedNotification } from '@dragonfish/shared/models/accounts/notifications/content';
import { Observable, throwError } from 'rxjs';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { catchError, tap } from 'rxjs/operators';

interface NotificationsProps {
    contentUpdates: ContentUpdatedNotification[];
}

const { state, config } = createState(
    withEntities<Notification, '_id'>({ idKey: '_id' }),
    withProps<NotificationsProps>({ contentUpdates: [] }),
    withActiveIds(),
);

const store = new Store({ state, name: 'notifications', config });

@Injectable({ providedIn: 'root' })
export class NotificationsRepository {
    public all$: Observable<Notification[]> = store.pipe(selectAll());
    public contentUpdates$: Observable<ContentUpdatedNotification[]> = store.pipe(
        select((store) => store.contentUpdates),
    );

    constructor(
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
        private pseuds: PseudonymsQuery,
    ) {}

    public getAllUnread() {
        return this.network.fetchAllUnread(this.pseuds.currentId).pipe(
            tap((data) => {
                const generalNotifications = data.filter((notification) => {
                    return notification.kind !== NotificationKind.ContentUpdate;
                });

                const contentUpdates = data.filter((notification) => {
                    return notification.kind === NotificationKind.ContentUpdate;
                });

                store.update(setEntities(generalNotifications));
                store.update((state) => ({
                    ...state,
                    contentUpdates: contentUpdates as ContentUpdatedNotification[],
                }));
            }),
        );
    }

    public addToActive(id: string) {
        store.update(addActiveIds([id]));
    }

    public removeFromActive(...ids: string[]) {
        store.update(removeActiveIds(ids));
    }

    public isActive(id: string) {
        return (
            this.activeIds.filter((item) => {
                return item === id;
            }).length !== 0
        );
    }

    public markAsRead() {
        const ids = this.activeIds;
        this.removeFromActive(...ids);
        return this.network.markNotificationsAsRead(this.pseuds.currentId, { ids: ids }).pipe(
            catchError((err) => {
                this.alerts.error(`Something went wrong! Try again in a little bit.`);
                return throwError(err);
            }),
        );
    }

    public markUpdatedAsRead(contentId: string) {
        return this.network.markUpdatedAsRead(this.pseuds.currentId, contentId).pipe(
            tap(() => {
                store.update((state) => ({
                    ...state,
                    contentUpdates: state.contentUpdates.filter((item) => {
                        return item.contentId !== contentId;
                    }),
                }));
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong trying to mark this update as read!`);
                return throwError(err);
            }),
        );
    }

    public checkIfUpdated(id: string) {
        const isUpdated = store.getValue().contentUpdates.filter((item) => {
            return item.contentId === id;
        });
        return isUpdated.length > 0;
    }

    //#region ---GETTERS---

    public get activeIds() {
        return store.query<string[]>(getActiveIds);
    }

    public get count() {
        return Object.keys(store.getValue().entities).length;
    }

    public get selected() {
        return this.activeIds.length;
    }

    public get countContentUpdates() {
        return store.getValue().contentUpdates.length;
    }

    //#endregion
}
