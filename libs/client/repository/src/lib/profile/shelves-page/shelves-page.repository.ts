import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { Bookshelf, ShelfItem } from '@dragonfish/shared/models/users/content-library';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ProfileRepository } from '../profile.repository';
import { AlertsService } from '@dragonfish/client/alerts';
import { catchError, tap } from 'rxjs/operators';
import { map, throwError, zip } from 'rxjs';

interface ShelvesPageProps {
    shelves: Bookshelf[];
    current: Bookshelf;
    items: ShelfItem[];
}

const { state, config } = createState(withProps<ShelvesPageProps>({ shelves: [], current: null, items: null }));

const store = new Store({ state, name: 'shelves-page', config });

@Injectable({ providedIn: 'root' })
export class ShelvesPageRepository {
    public shelves$ = store.pipe(select((state) => state.shelves));
    public current$ = store.pipe(select((state) => state.current));
    public items$ = store.pipe(select((state) => state.items));

    constructor(
        private network: DragonfishNetworkService,
        private profile: ProfileRepository,
        private alerts: AlertsService,
    ) {}

    public fetchShelves() {
        return this.network.fetchPublicShelves(this.profile.profileId).pipe(
            tap((shelves) => {
                store.update((state) => ({
                    ...state,
                    shelves: shelves,
                }));
            }),
            map(() => {
                return;
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    public fetchOneShelf(id: string) {
        return zip(
            this.network.fetchOneShelf(this.profile.profileId, id),
            this.network.fetchShelfItems(this.profile.profileId, id),
        ).pipe(
            tap((results) => {
                const [shelf, items] = results;
                store.update((state) => ({
                    ...state,
                    current: shelf,
                    items: items,
                }));
            }),
            map(() => {
                return;
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }
}
