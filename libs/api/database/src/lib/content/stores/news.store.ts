import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { countWords, stripTags } from 'voca';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { ContentRating, NewsForm, PubChange } from '@dragonfish/shared/models/content';
import { NewsContentDocument } from '../schemas';

@Injectable()
export class NewsStore {
    constructor(@InjectModel('NewsContent') private readonly newsModel: PaginateModel<NewsContentDocument>) {}

    /**
     * Creates a new newspost and saves it to the database.
     *
     * @param user The user creating the post
     * @param postInfo The post's info
     */
    async createNewPost(user: string, postInfo: NewsForm): Promise<NewsContentDocument> {
        const newPost = new this.newsModel({
            author: user,
            title: sanitizeHtml(postInfo.title),
            body: sanitizeHtml(postInfo.body, sanitizeOptions),
            'meta.category': postInfo.category,
            'meta.rating': ContentRating.Everyone,
            'stats.words': countWords(stripTags(sanitizeHtml(postInfo.body, sanitizeOptions))),
        });

        return newPost.save();
    }

    /**
     * Edits a post belonging to a user, unless the user requesting to edit is an admin or moderator.
     *
     * @param user The user requesting to edit
     * @param postId The post to edit
     * @param postInfo The new info to add
     */
    async editPost(user: string, postId: string, postInfo: NewsForm): Promise<NewsContentDocument> {
        return this.newsModel
            .findByIdAndUpdate(
                postId,
                {
                    title: sanitizeHtml(postInfo.title),
                    body: sanitizeHtml(postInfo.body, sanitizeOptions),
                    'meta.category': postInfo.category,
                    'stats.words': countWords(stripTags(sanitizeHtml(postInfo.body, sanitizeOptions))),
                },
                { new: true },
            )
            .where('author', user);
    }

    /**
     * Changes the publish status of a post. If isPublished is true, it
     * sets a new publishedOn date.
     *
     * @param user The user in charge of this post
     * @param postId The post itself
     * @param pubChange The publish flag
     */
    async setPublishStatus(user: string, postId: string, pubChange: PubChange): Promise<NewsContentDocument> {
        return this.newsModel.findOneAndUpdate(
            { _id: postId, author: user },
            {
                'audit.published': pubChange.newStatus,
                'audit.publishedOn': new Date(),
            },
            { new: true },
        );
    }
}
