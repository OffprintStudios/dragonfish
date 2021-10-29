import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { Bookshelf, BookshelfForm, ShelfItem } from '@dragonfish/shared/models/users/content-library';
import {
    withEntities,
    selectAll,
    setEntities,
    addEntities,
    withActiveId,
    selectActiveEntity,
    getActiveId,
    updateEntities,
    deleteEntities,
    setActiveId,
} from '@ngneat/elf-entities';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { PseudonymsQuery } from '../../pseudonyms';
import { map, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContentModel } from '@dragonfish/shared/models/content';

interface BookshelvesProps {
    items: ShelfItem[];
}

const { state, config } = createState(
    withProps<BookshelvesProps>({ items: [] }),
    withEntities<Bookshelf, '_id'>({ idKey: '_id' }),
    withActiveId(),
);

const store = new Store({ state, name: 'bookshelves', config });

@Injectable({ providedIn: 'root' })
export class BookshelvesRepository {
    public current$: Observable<Bookshelf> = store.pipe(selectActiveEntity());
    public items$: Observable<ShelfItem[]> = store.pipe(select((state) => state.items));
    public shelves$: Observable<Bookshelf[]> = store.pipe(selectAll());

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

    public fetchShelfItems(profileId: string, shelfId: string): Observable<void> {
        return this.network.fetchShelfItems(profileId, shelfId).pipe(
            tap((items) => {
                store.update((state) => ({
                    ...state,
                    items: items,
                }));
            }),
            map(() => {
                return;
            }),
        );
    }

    public setCurrent(shelfId: string) {
        store.update(setActiveId(shelfId));
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
                store.update((store) => ({
                    ...store,
                    items: null,
                }));
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

    //#region ---SHELF ITEMS---

    public addItem(profileId: string, shelfId: string, contentId: string): Observable<void> {
        return this.network.addShelfItem(profileId, shelfId, contentId).pipe(
            catchError((err) => {
                console.log(err);
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    public removeItem(profileId: string, shelfId: string, contentId: string): Observable<void> {
        return this.network.removeShelfItem(profileId, shelfId, contentId).pipe(
            tap(() => {
                store.update((state) => ({
                    ...state,
                    items: state.items.filter((x) => {
                        return (x.content as ContentModel)._id !== contentId;
                    }),
                }));
            }),
        );
    }

    public checkItem(profileId: string, shelfId: string, contentId: string): Observable<boolean> {
        return this.network.checkShelfItem(profileId, shelfId, contentId).pipe(
            map((res) => {
                return res.isPresent;
            }),
        );
    }

    //#endregion

    //#region ---GETTERS---

    public get count() {
        if (store.getValue().entities) {
            return Object.keys(store.getValue().entities).length;
        } else {
            return 0;
        }
    }

    public get currentId() {
        return store.query(getActiveId);
    }

    //#endregion
}
