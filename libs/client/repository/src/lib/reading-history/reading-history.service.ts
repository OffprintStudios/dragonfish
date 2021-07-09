import { Injectable } from '@angular/core';
import { ReadingHistoryQuery } from './reading-history.query';
import { ReadingHistoryStore } from './reading-history.store';
import { AlertsService } from '@dragonfish/client/alerts';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { catchError, tap } from 'rxjs/operators';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReadingHistoryService {
    constructor(
        private historyQuery: ReadingHistoryQuery,
        private historyStore: ReadingHistoryStore,
        private alerts: AlertsService,
        private network: DragonfishNetworkService,
    ) {}

    public fetch() {
        return this.network.fetchUserHistory().pipe(
            tap((val: ReadingHistory[]) => {
                this.historyStore.set(val);
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong fetching your reading history!`);
                return throwError(err);
            }),
        );
    }

    public select(docId: string) {
        this.historyStore.addActive(docId);
    }

    public deselect(docId: string) {
        this.historyStore.removeActive(docId);
    }

    public delete(docIds: string[]) {
        return this.network.changeHistoryVisibility(docIds).pipe(
            tap(() => {
                this.historyStore.removeActive(docIds);
                this.historyStore.remove(docIds);
            }),
        );
    }
}
