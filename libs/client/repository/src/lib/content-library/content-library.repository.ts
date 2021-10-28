import { Injectable } from '@angular/core';
import { Store, createState } from '@ngneat/elf';
import {
    deleteEntitiesByPredicate,
    getActiveId,
    selectActiveEntity,
    selectAll,
    setEntities,
    withActiveId,
    withEntities,
} from '@ngneat/elf-entities';
import { ContentLibrary } from '@dragonfish/shared/models/users/content-library';
import { map, Observable, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { PseudonymsQuery } from '../pseudonyms';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentModel } from '@dragonfish/shared/models/content';

const { state, config } = createState(withEntities<ContentLibrary, '_id'>({ idKey: '_id' }), withActiveId());
const store = new Store({ state, name: 'content-library', config });

@Injectable({ providedIn: 'root' })
export class ContentLibraryRepository {
    public all$: Observable<ContentLibrary[]> = store.pipe(selectAll());
    public current$: Observable<ContentLibrary> = store.pipe(selectActiveEntity());

    constructor(
        private network: DragonfishNetworkService,
        private pseudQuery: PseudonymsQuery,
        private alerts: AlertsService,
    ) {}

    public fetchLibrary() {
        return this.network.fetchLibrary(this.pseudQuery.currentId).pipe(
            tap((results) => {
                store.update(setEntities(results));
            }),
            map(() => {
                return;
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong fetching your library!`);
                return throwError(err);
            }),
        );
    }

    public addToLibrary(contentId: string) {
        return this.network.addToLibrary(this.pseudQuery.currentId, contentId).pipe(
            delay(300),
            catchError((err) => {
                this.alerts.error(`Something went wrong adding this to your library!`);
                return throwError(err);
            }),
        );
    }

    public removeFromLibrary(contentId: string) {
        return this.network.removeFromLibrary(this.pseudQuery.currentId, contentId).pipe(
            delay(300),
            tap(() => {
                store.update(deleteEntitiesByPredicate((entity) => (entity.content as ContentModel)._id === contentId));
            }),
            map(() => {
                return;
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong removing this from your library!`);
                return throwError(err);
            }),
        );
    }

    //#region ---GETTERS---

    public get currentId() {
        return store.query<string>(getActiveId);
    }

    public get count() {
        if (store.getValue().entities) {
            return Object.keys(store.getValue().entities).length;
        } else {
            return 0;
        }
    }

    //#endregion
}
