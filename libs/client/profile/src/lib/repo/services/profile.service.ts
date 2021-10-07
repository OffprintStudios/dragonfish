import { Injectable } from '@angular/core';
import { ProfileQuery } from '../profile.query';
import { ProfileStore } from '../profile.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { catchError, tap, take } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';
import { AppQuery } from '@dragonfish/client/repository/app';
import {
    BlogForm,
    BlogsContentModel,
    ContentKind,
    ContentModel,
    FormType,
    PubChange,
} from '@dragonfish/shared/models/content';

@Injectable()
export class ProfileService {
    constructor(
        private profileQuery: ProfileQuery,
        private profileStore: ProfileStore,
        private appQuery: AppQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public setProfile(pseudId: string) {
        this.profileStore.setLoading(true);
        return zip(
            this.network.getProfile(pseudId),
            this.network.getProfileContent(pseudId, this.appQuery.filter),
        ).pipe(
            tap((result) => {
                this.profileStore.update({
                    currProfile: result[0],
                    homeWorks: result[1].works,
                    homeBlogs: result[1].blogs,
                });
                this.profileStore.setLoading(false);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    public fetchBlogsList() {
        this.profileStore.setLoading(true);
        return this.network.fetchAllByKind(this.profileQuery.profileId, [ContentKind.BlogContent]).pipe(
            tap((content) => {
                this.profileStore.update({
                    pubBlogs: content.filter((item) => {
                        return item.audit.published === 'Published';
                    }) as BlogsContentModel[],
                    draftBlogs: content.filter((item) => {
                        return item.audit.published === 'Unpublished';
                    }) as BlogsContentModel[],
                });
                this.profileStore.setLoading(false);
            }),
        );
    }

    public fetchWorksList() {
        this.profileStore.setLoading(true);
        return this.network
            .fetchAllByKind(this.profileQuery.profileId, [ContentKind.PoetryContent, ContentKind.ProseContent])
            .pipe(
                tap((content) => {
                    this.profileStore.update({
                        pubWorks: content.filter((item) => {
                            return item.audit.published === 'Published';
                        }) as ContentModel[],
                        draftWorks: content.filter((item) => {
                            return item.audit.published === 'Unpublished';
                        }) as ContentModel[],
                    });
                    this.profileStore.setLoading(false);
                }),
            );
    }

    public fetchOneUnpublished(id: string, kind: ContentKind) {
        return this.network.fetchOne(this.profileQuery.profileId, id, kind);
    }

    //#region ---CRUD OPERATIONS---

    public createBlog(formInfo: BlogForm) {
        return this.createContent(ContentKind.BlogContent, formInfo);
    }

    public editBlog(blogId: string, formInfo: BlogForm) {
        return this.network.saveContent(this.profileQuery.profileId, blogId, ContentKind.BlogContent, formInfo);
    }

    public publishBlog(blogId: string, pubChange: PubChange) {
        return this.network.publishOne(this.profileQuery.profileId, blogId, pubChange);
    }

    public deleteBlog(blogId: string) {
        return this.network.deleteOne(this.profileQuery.profileId, blogId).pipe(
            tap(() => {
                this.refetchContent(ContentKind.BlogContent);
            }),
        );
    }

    public createWork(formInfo: FormType, kind: ContentKind) {
        return this.createContent(kind, formInfo);
    }

    public refetchContent(kind: ContentKind) {
        if (kind === 'BlogContent') {
            this.fetchBlogsList().pipe(take(1)).subscribe();
        } else if (kind === 'NewsContent') {
            this.alerts.info(`News content fetching not yet implemented.`);
        } else {
            this.fetchWorksList().pipe(take(1)).subscribe();
        }
    }

    //#endregion

    //#region ---PRIVATE---

    private createContent(kind: ContentKind, formInfo: FormType) {
        return this.network.createContent(this.profileQuery.profileId, kind, formInfo).pipe(
            tap(() => {
                this.refetchContent(kind);
            }),
        );
    }

    //#endregion
}
