import { Injectable } from '@angular/core';
import { ContentLibraryStore } from './content-library.store';
import { ContentLibraryQuery } from './content-library.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { catchError, tap, delay } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContentLibraryService {
    constructor(
        private store: ContentLibraryStore,
        private query: ContentLibraryQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
        private pseudQuery: PseudonymsQuery,
    ) {}

    public fetchLibrary() {
        return this.network.fetchLibrary(this.pseudQuery.currentId).pipe(
            tap((results) => {
                this.store.set(results);
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
                if (this.query.getAll()) {
                    this.store.remove(contentId);
                }
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong removing this from your library!`);
                return throwError(err);
            }),
        );
    }
}
