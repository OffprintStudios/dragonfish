import { Injectable } from '@angular/core';
import { UserBlogsQuery } from './user-blogs.query';
import { UserBlogsStore } from './user-blogs.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { BlogForm, BlogsContentModel, ContentKind, NewsChange, PubChange } from '@dragonfish/shared/models/content';
import { AppQuery } from '../../app';
import { ProfileQuery } from '../profile.query';
import { tap } from 'rxjs/operators';
import { PseudonymsQuery } from '../../pseudonyms';

@Injectable({ providedIn: 'root' })
export class UserBlogsService {
    constructor(
        private userBlogsStore: UserBlogsStore,
        private userBlogsQuery: UserBlogsQuery,
        private appQuery: AppQuery,
        private profileQuery: ProfileQuery,
        private pseudQuery: PseudonymsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public getPage(page: number, publishedOnly: boolean) {
        if (publishedOnly) {
            return this.network
                .fetchAllContent(page, [ContentKind.BlogContent], this.appQuery.filter, this.profileQuery.profileId)
                .pipe(
                    tap((content) => {
                        this.userBlogsStore.set(content.docs as BlogsContentModel[]);
                        this.userBlogsStore.update({
                            currPage: page,
                            totalBlogs: content.totalDocs,
                            perPage: content.limit,
                            totalPages: content.totalPages,
                        });
                    }),
                );
        } else {
            return this.network.fetchAllByKind(this.pseudQuery.currentId, [ContentKind.BlogContent]).pipe(
                tap((content) => {
                    this.userBlogsStore.set(content.docs as BlogsContentModel[]);
                    this.userBlogsStore.update({
                        currPage: page,
                        totalBlogs: content.totalDocs,
                        perPage: content.limit,
                        totalPages: content.totalPages,
                    });
                }),
            );
        }
    }

    //#region ---CRUD OPERATIONS--

    public create(formInfo: BlogForm) {
        return this.network.createContent(this.pseudQuery.currentId, ContentKind.BlogContent, formInfo).pipe(
            tap((content) => {
                if (this.userBlogsQuery.totalBlogs === 0) {
                    this.userBlogsStore.set([content as BlogsContentModel]);
                    this.userBlogsStore.update({
                        totalBlogs: 1,
                    });
                } else {
                    this.userBlogsStore.add(content as BlogsContentModel, { prepend: true });
                }
                this.alerts.success(`Blog created successfully!`);
            }),
        );
    }

    public publish(blogId: string, pubChange: PubChange) {
        return this.network.publishOne(this.profileQuery.profileId, blogId, pubChange).pipe(
            tap((content) => {
                this.userBlogsStore.update(blogId, content as BlogsContentModel);
            }),
        );
    }

    public delete(blogId: string) {
        return this.network.deleteOne(this.profileQuery.profileId, blogId).pipe(
            tap(() => {
                this.userBlogsStore.remove(blogId);
            }),
        );
    }

    public convertToNewsPost(newsChange: NewsChange) {
        return this.network.toggleNewsPost(this.profileQuery.profileId, newsChange).pipe(
            tap((blog) => {
                this.userBlogsStore.update(blog._id, blog);
                if (blog.audit.isNewsPost) {
                    this.alerts.success(`This post is now viewable from the news feed.`);
                } else {
                    this.alerts.success(`This post has been removed from the news feed.`);
                }
            }),
        );
    }

    //#endregion
}
