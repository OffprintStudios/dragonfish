import { Injectable } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { ContentKind, FormType } from '@dragonfish/shared/models/content';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page/work-page.query';
import { WorkPageStore } from '@dragonfish/client/repository/work-page/work-page.store';
import { catchError, tap } from 'rxjs/operators';
import { AlertsService } from '@dragonfish/client/alerts';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkPageService {
    constructor(
        private network: DragonfishNetworkService,
        private pseudQuery: PseudonymsQuery,
        private workQuery: WorkPageQuery,
        private workStore: WorkPageStore,
        private alerts: AlertsService,
    ) {}

    //#region ---FETCHING---

    public fetchContent(id: string) {
        return this.network.fetchOne(this.pseudQuery.currentId, id).pipe(
            tap((result) => {
                this.workStore.update({
                    content: result.content,
                    ratings: result.ratings,
                });
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong!`);
                return throwError(err);
            }),
        );
    }

    //#endregion

    //#region ---CRUD OPERATIONS---

    public createWork(kind: ContentKind, formInfo: FormType) {
        return this.network.createContent(this.pseudQuery.currentId, kind, formInfo);
    }

    //#endregion
}
