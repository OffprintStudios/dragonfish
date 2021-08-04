import { Injectable } from '@angular/core';
import { LocalTagsStore } from './local-tags.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { TagKind, TagsForm, TagsModel } from '@dragonfish/shared/models/content/tags';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TagsTree } from '@dragonfish/shared/models/content/tags/tags.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
    constructor(
        private tagsStore: LocalTagsStore,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public fetchTagsTrees(kind: TagKind): Observable<TagsTree[]> {
        return this.network.fetchTagsTrees(kind).pipe(
            tap(value => {
                for (let tree of value) {
                    if (tree.children != null) {
                        tree.children.sort(
                            (a,b) => a.name < b.name ? -1 : 1
                        )
                    }
                }
                this.tagsStore.set(value)
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
            tap(newTag => {
                this.fetchTagsTrees(TagKind.Fandom).subscribe();
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public updateTag(id: string, form: TagsForm): Observable<TagsModel> {
        return this.network.updateTag(id, form).pipe(
            tap(updatedTag => {
                this.fetchTagsTrees(TagKind.Fandom).subscribe();
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
                this.fetchTagsTrees(TagKind.Fandom).subscribe();
                this.alerts.success(`Tag successfully deleted.`);
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }
}
