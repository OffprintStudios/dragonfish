import { Injectable } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { PseudonymsQuery } from '../pseudonyms';
import { ContentKind, ContentModel, FormType } from '@dragonfish/shared/models/content';
import { WorkPageQuery } from './work-page.query';
import { WorkPageStore } from './work-page.store';
import { catchError, tap } from 'rxjs/operators';
import { AlertsService } from '@dragonfish/client/alerts';
import { throwError } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { SectionsService } from './sections';
import { PublishSection, Section } from '@dragonfish/shared/models/sections';

@Injectable({ providedIn: 'root' })
export class WorkPageService {
    constructor(
        private network: DragonfishNetworkService,
        private pseudQuery: PseudonymsQuery,
        private workQuery: WorkPageQuery,
        private workStore: WorkPageStore,
        private alerts: AlertsService,
        private router: Router,
        private sections: SectionsService,
    ) {}

    //#region ---FETCHING---

    public fetchContent(id: string) {
        return this.network.fetchOne(this.pseudQuery.currentId, id).pipe(
            tap((result) => {
                this.workStore.update({
                    content: result.content,
                    ratings: result.ratings,
                    wordCount: result.content.stats.words,
                });
                this.sections.setSections((result.content as any).sections);
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

    public save(contentId: string, kind: ContentKind, formInfo: FormType) {
        return this.network.saveContent(this.pseudQuery.currentId, contentId, kind, formInfo).pipe(
            tap((result: ContentModel) => {
                this.workStore.update({
                    content: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public delete(contentId: string) {
        return this.network.deleteOne(this.pseudQuery.currentId, contentId).pipe(
            tap(() => {
                this.workStore.update({
                    content: null,
                    ratings: null,
                });
                this.router.navigate(['/']).catch((err) => console.log(err));
                this.alerts.success(`Content successfully deleted!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public publish(contentId: string) {
        return this.network.publishOne(this.pseudQuery.currentId, contentId).pipe(
            tap((result: ContentModel) => {
                this.workStore.update({
                    content: result,
                });
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
                this.workStore.update({
                    content: result,
                });
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
            this.workStore.update({
                wordCount: this.workQuery.wordCount + section.stats.words,
            });
        } else if (section.published === false && pubStatus.oldPub === true) {
            // if unpublished
            if (this.workQuery.wordCount !== 0) {
                this.workStore.update({
                    wordCount: this.workQuery.wordCount - section.stats.words,
                });
            }
        }
    }

    //#endregion
}
