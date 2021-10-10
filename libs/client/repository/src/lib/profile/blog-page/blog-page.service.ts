import { Injectable } from '@angular/core';
import { BlogPageStore } from './blog-page.store';
import { BlogPageQuery } from './blog-page.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { BlogForm, BlogsContentModel, ContentKind, PubChange } from '@dragonfish/shared/models/content';
import { AppQuery } from '../../app';
import { ProfileQuery } from '../profile.query';
import { catchError, tap } from 'rxjs/operators';
import { PseudonymsQuery } from '../../pseudonyms';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogPageService {
    constructor(
        private blogPageStore: BlogPageStore,
        private blogPageQuery: BlogPageQuery,
        private appQuery: AppQuery,
        private profileQuery: ProfileQuery,
        private pseudQuery: PseudonymsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public fetchContent(id: string) {
        return this.network.fetchOne(id).pipe(
            tap((result) => {
                this.blogPageStore.update({
                    blog: result.content as BlogsContentModel,
                });
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong!`);
                return throwError(err);
            }),
        );
    }

    //#region ---CRUD OPERATIONS--

    public edit(blogId: string, formInfo: BlogForm) {
        return this.network.saveContent(this.profileQuery.profileId, blogId, ContentKind.BlogContent, formInfo).pipe(
            tap((content) => {
                this.blogPageStore.update({
                    blog: content as BlogsContentModel,
                });
                this.alerts.success(`Blog updated successfully!`);
            }),
        );
    }

    public publish(blogId: string, pubChange: PubChange) {
        return this.network.publishOne(this.profileQuery.profileId, blogId, pubChange).pipe(
            tap((content) => {
                this.blogPageStore.update({
                    blog: content as BlogsContentModel,
                });
            }),
        );
    }

    //#endregion
}
