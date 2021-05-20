import { Injectable } from '@angular/core';
import { MyStuffStore } from './my-stuff.store';
import { MyStuffQuery } from './my-stuff.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { throwError, EMPTY } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { ContentKind, ContentModel, FormType } from '@dragonfish/shared/models/content';

@Injectable({ providedIn: 'root' })
export class MyStuffService {
    constructor(
        private myStuffStore: MyStuffStore,
        private myStuffQuery: MyStuffQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService
    ) {}

    public setAll() {
        return this.myStuffQuery.selectHasCache().pipe(
            switchMap(hasCache => {
                const apiCall = this.network.fetchAll().pipe(
                    tap((result: ContentModel[]) => {
                        this.myStuffStore.set(result);
                    }),
                    catchError(err => {
                        this.alerts.error(`Something went wrong fetching your content!`);
                        return throwError(err);
                    }),
                );

                return hasCache ? EMPTY : apiCall;
            }),
        );
    }

    public setActive(contentId: string) {
        this.myStuffStore.setActive(contentId);
    }

    public create(kind: ContentKind, formInfo: FormType) {
        return this.network.createContent(kind, formInfo).pipe(
            tap((result: ContentModel) => {
                this.myStuffStore.add(result);
                this.myStuffStore.setActive(result._id);
                this.alerts.success(`Content saved!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    public save(contentId: string, kind: ContentKind, formInfo: FormType) {
        return this.network.saveContent(contentId, kind, formInfo).pipe(
            tap((result: ContentModel) => {
                this.myStuffStore.update(contentId, result);
                this.alerts.success(`Changes saved!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }
}
