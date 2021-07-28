import { Injectable } from '@angular/core';
import { LocalTagsStore } from './local-tags.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { TagKind, TagsForm, TagsModel } from '@dragonfish/shared/models/content';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TagsTree } from '@dragonfish/shared/models/content/tags.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
    constructor(
        private tagsStore: LocalTagsStore,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public fetchTags(kind: TagKind): Observable<TagsModel[]> {
        return this.network.fetchTags(kind).pipe(
            tap(value => {
                this.tagsStore.set(value);
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public fetchDescendants(id: string): Observable<TagsTree> {
        return this.network.fetchDescendants(id).pipe(
            tap(() => {}),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            })
        )
    }

    public createTag(kind: TagKind, form: TagsForm): Observable<TagsModel> {
        return this.network.createTag(kind, form).pipe(
            tap(value => {
                this.tagsStore.add(value);
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public updateTag(id: string, form: TagsForm): Observable<TagsModel> {
        return this.network.updateTag(id, form).pipe(
            tap(value => {
                this.tagsStore.update(id, value);
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public deleteTag(id: string): Observable<void> {
        return this.network.deleteTag(id).pipe(
            tap(() => {
                this.tagsStore.remove(id);
                this.alerts.success(`Tag successfully deleted.`);
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }
}
