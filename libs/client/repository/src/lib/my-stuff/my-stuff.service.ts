import { Injectable } from '@angular/core';
import { MyStuffStore } from './my-stuff.store';
import { MyStuffQuery } from './my-stuff.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { throwError, EMPTY } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { ContentKind, ContentModel, FormType, PubChange } from '@dragonfish/shared/models/content';
import { FileUploader } from 'ng2-file-upload';
import { PublishSection, Section } from '@dragonfish/shared/models/sections';

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
                        return throwError(() => err);
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
                return throwError(() => err);
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
                return throwError(() => err);
            }),
        );
    }

    public delete(contentId: string) {
        return this.network.deleteOne(contentId).pipe(
            tap(() => {
                this.myStuffStore.remove(contentId);
                this.alerts.success(`Content successfully deleted!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public publish(contentId: string, pubChange?: PubChange) {
        return this.network.publishOne(contentId, pubChange).pipe(
            tap((result: ContentModel) => {
                this.myStuffStore.update(contentId, result);
                this.alerts.success(`Changes saved!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public uploadCoverArt(uploader: FileUploader) {
        return this.network.changeImage(uploader).pipe(
            tap((result: ContentModel) => {
                this.myStuffStore.update(result._id, result);
                this.alerts.success(`Changes saved!`);
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong! Try again in a little bit.`);
                return throwError(() => err);
            }),
        );
    }

    public updateWordCount(section: Section, pubStatus: PublishSection) {
        if (section.published === true && pubStatus.oldPub === false) {
            // if newly published
            this.myStuffStore.update(this.myStuffQuery.currentId, entity => {
                return {
                    ...entity,
                    stats: {
                        ...entity.stats,
                        words: this.myStuffQuery.currentWordCount + section.stats.words,
                    },
                };
            });
        } else if (section.published === false && pubStatus.oldPub === true) {
            // if unpublished
            this.myStuffStore.update(this.myStuffQuery.currentId, entity => {
                return {
                    ...entity,
                    stats: {
                        ...entity.stats,
                        words: this.myStuffQuery.currentWordCount - section.stats.words,
                    },
                };
            });
        }
    }
}
