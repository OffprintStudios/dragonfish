import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { Bookshelf, BookshelfForm, ShelfItem } from '@dragonfish/shared/models/users/content-library';
import {
    withEntities,
    selectAll,
    setEntities,
    addEntities,
    updateEntities,
    deleteEntities,
} from '@ngneat/elf-entities';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { map, Observable, of, zip } from 'rxjs';
import { tap } from 'rxjs/operators';

interface BookshelvesProps {
    current: Bookshelf;
    items: ShelfItem[];
}

const { state, config } = createState(
    withProps<BookshelvesProps>({ current: null, items: [] }),
    withEntities<Bookshelf, '_id'>({ idKey: '_id' }),
);

const store = new Store({ state, name: 'bookshelves', config });

@Injectable({ providedIn: 'root' })
export class BookshelvesRepository {
    public current$ = store.pipe(select((state) => state.current));
    public items$ = store.pipe(select((state) => state.items));
    public shelves$ = store.pipe(selectAll());

    constructor(
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
        private pseudQuery: PseudonymsQuery,
    ) {}

    //#region ---SHELVES---

    public fetchShelves(): Observable<void> {
        if (this.pseudQuery.currentId) {
            return this.network.fetchShelves(this.pseudQuery.currentId).pipe(
                tap((shelves) => {
                    store.update(setEntities(shelves));
                }),
                map(() => {
                    return;
                }),
            );
        } else {
            return of(null).pipe(
                tap(() => {
                    this.alerts.error(`Please select a profile first.`);
                }),
                map(() => {
                    return;
                }),
            );
        }
    }

    public fetchPublicShelves(profileId: string): Observable<void> {
        return this.network.fetchPublicShelves(profileId).pipe(
            tap((shelves) => {
                store.update(setEntities(shelves));
            }),
            map(() => {
                return;
            }),
        );
    }

    public fetchOneShelf(profileId: string, shelfId: string): Observable<void> {
        return zip(
            this.network.fetchOneShelf(profileId, shelfId),
            this.network.fetchShelfItems(profileId, shelfId),
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
        );
    }

    public createShelf(profileId: string, formInfo: BookshelfForm): Observable<void> {
        return this.network.createShelf(profileId, formInfo).pipe(
            tap((shelf) => {
                store.update(addEntities(shelf));
            }),
            map(() => {
                return;
            }),
        );
    }

    public editShelf(profileId: string, shelfId: string, formInfo: BookshelfForm): Observable<void> {
        return this.network.editShelf(profileId, shelfId, formInfo).pipe(
            tap((shelf) => {
                store.update(updateEntities(shelfId, shelf));
            }),
            map(() => {
                return;
            }),
        );
    }

    public deleteShelf(profileId: string, shelfId: string): Observable<void> {
        return this.network.deleteShelf(profileId, shelfId).pipe(
            tap(() => {
                store.update(deleteEntities(shelfId));
            }),
        );
    }

    public toggleVisibility(profileId: string, shelfId: string): Observable<void> {
        return this.network.toggleShelfVisibility(profileId, shelfId).pipe(
            tap((shelf) => {
                store.update(updateEntities(shelfId, shelf));
            }),
            map(() => {
                return;
            }),
        );
    }

    //#endregion
}
