import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { countWords, stripTags } from 'voca';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import {
    ContentFilter,
    ContentRating,
    NewsContentModel,
    NewsForm,
    PubChange,
    PubStatus,
} from '@dragonfish/shared/models/content';
import { Roles } from '@dragonfish/shared/models/users';
import { NewsContentDocument } from './news-content.document';
import { isAllowed } from '@dragonfish/shared/functions';
import { RatingsStore } from '../../ratings';

@Injectable()
export class NewsStore {
    constructor(
        @InjectModel('NewsContent') private readonly newsModel: PaginateModel<NewsContentDocument>,
        private readonly ratingsService: RatingsStore
    ) {}

    /**
     * Creates a new newspost and saves it to the database.
     *
     * @param user The user creating the post
     * @param postInfo The post's info
     */
    async createNewPost(user: JwtPayload, postInfo: NewsForm): Promise<NewsContentDocument> {
        if (isAllowed(user.roles as Roles[], [Roles.Contributor, Roles.Moderator, Roles.Admin])) {
            const newPost = new this.newsModel({
                author: user.sub,
                title: sanitizeHtml(postInfo.title),
                body: sanitizeHtml(postInfo.body, sanitizeOptions),
                'meta.category': postInfo.category,
                'meta.rating': ContentRating.Everyone,
                'stats.words': countWords(stripTags(sanitizeHtml(postInfo.body, sanitizeOptions))),
            });

            const post = await newPost.save();
            await this.ratingsService.createRatingsDoc(post._id);
            return post;
        } else {
            throw new UnauthorizedException(`You don't have permission to create news posts.`);
        }
    }

    /**
     * Edits a post belonging to a user, unless the user requesting to edit is an admin or moderator.
     *
     * @param user The user requesting to edit
     * @param postId The post to edit
     * @param postInfo The new info to add
     */
    async editPost(user: JwtPayload, postId: string, postInfo: NewsForm): Promise<NewsContentDocument> {
        if (isAllowed(user.roles as Roles[], [Roles.Contributor, Roles.Admin, Roles.Moderator])) {
            return this.newsModel.findByIdAndUpdate(
                postId,
                {
                    title: sanitizeHtml(postInfo.title),
                    body: sanitizeHtml(postInfo.body, sanitizeOptions),
                    'meta.category': postInfo.category,
                    'stats.words': countWords(stripTags(sanitizeHtml(postInfo.body, sanitizeOptions))),
                },
                { new: true }
            );
        } else {
            throw new UnauthorizedException(`You don't have permission to edit this post.`);
        }
    }

    /**
     * Changes the publish status of a post. If isPublished is true, it
     * sets a new publishedOn date.
     *
     * @param user The user in charge of this post
     * @param postId The post itself
     * @param isPublished The publish flag
     */
    async setPublishStatus(user: JwtPayload, postId: string, pubChange: PubChange): Promise<NewsContentDocument> {
        if (isAllowed(user.roles as Roles[], [Roles.Contributor, Roles.Admin, Roles.Moderator])) {
            return this.newsModel.findOneAndUpdate(
                { _id: postId, author: user.sub },
                {
                    'audit.published': pubChange.newStatus,
                    'audit.publishedOn': new Date(),
                },
                { new: true }
            );
        } else {
            throw new UnauthorizedException(`You don't have permission to publish this.`);
        }
    }

    /**
     * Fetches for the home page.
     */
    async fetchForHome(filter: ContentFilter): Promise<NewsContentModel[]> {
        const query = { 'audit.isDeleted': false, 'audit.published': PubStatus.Published };
        const filteredQuery = await this.determineContentFilter(query, filter);
        return this.newsModel.find(filteredQuery).sort({ 'audit.publishedOn': -1 }).limit(6);
    }

    /**
     * Determines which settings to apply on the content filter by checking a user's filter settings.
     *
     * @param query The query to add to
     * @param filter The current filter settings
     */
    private async determineContentFilter(query: any, filter: ContentFilter) {
        switch (filter) {
            case ContentFilter.Everything:
                break;
            case ContentFilter.MatureEnabled:
                query['$or'] = [
                    { 'meta.rating': ContentRating.Everyone },
                    { 'meta.rating': ContentRating.Teen },
                    { 'meta.rating': ContentRating.Mature },
                ];
                break;
            case ContentFilter.ExplicitEnabled:
                query['$or'] = [
                    { 'meta.rating': ContentRating.Everyone },
                    { 'meta.rating': ContentRating.Teen },
                    { 'meta.rating': ContentRating.Explicit },
                ];
                break;
            default:
                query['$or'] = [{ 'meta.rating': ContentRating.Everyone }, { 'meta.rating': ContentRating.Teen }];
                break;
        }

        return query;
    }
}
