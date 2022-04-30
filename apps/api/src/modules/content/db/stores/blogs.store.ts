import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import { countWords, stripTags } from 'voca';
import { sanitizeOptions } from '$shared/util';
import { BlogsContentDocument } from '../schemas';
import { BlogForm, NewsChange, PubChange } from '$shared/models/content';

@Injectable()
export class BlogsStore {
    constructor(
        @InjectModel('BlogContent')
        private readonly blogsModel: PaginateModel<BlogsContentDocument>,
    ) {}

    /**
     * Creates a new blogpost and saves it to the database. Returns the newly
     * created blog as a promise.
     *
     * @param user The user making the blog.
     * @param blogInfo The blog's information.
     */
    async createNewBlog(user: string, blogInfo: BlogForm): Promise<BlogsContentDocument> {
        const newBlog = new this.blogsModel({
            author: user,
            title: sanitizeHtml(blogInfo.title),
            desc: blogInfo.desc ? sanitizeHtml(blogInfo.desc) : null,
            body: sanitizeHtml(blogInfo.body, sanitizeOptions),
            'meta.rating': blogInfo.rating,
            'stats.words': countWords(stripTags(sanitizeHtml(blogInfo.body, sanitizeOptions))),
        });

        return await newBlog.save();
    }

    /**
     * Edits a given user's blog using the provided information in the EditBlog
     * model.
     *
     * @param user The author of the blog
     * @param blogId The blog's ID
     * @param blogInfo The blog info for the update
     */
    async editBlog(
        user: string,
        blogId: string,
        blogInfo: BlogForm,
    ): Promise<BlogsContentDocument> {
        const wordCount = countWords(stripTags(sanitizeHtml(blogInfo.body, sanitizeOptions)));

        return this.blogsModel
            .findOneAndUpdate(
                { _id: blogId, author: user },
                {
                    title: sanitizeHtml(blogInfo.title),
                    desc: blogInfo.desc ? sanitizeHtml(blogInfo.desc) : null,
                    body: sanitizeHtml(blogInfo.body, sanitizeOptions),
                    'meta.rating': blogInfo.rating,
                    'stats.words': wordCount,
                },
                { new: true },
            )
            .populate('author');
    }

    /**
     * Changes the publishing status of the specified blog. If there was a change in the publishing status,
     * like from true to false, then change the blog count on the specified user accordingly. Otherwise, do
     * nothing.
     *
     * @param user The author of the blog
     * @param blogId The blog's ID
     * @param pubChange Object for change in publishing status
     */
    async changePublishStatus(
        user: string,
        blogId: string,
        pubChange: PubChange,
    ): Promise<BlogsContentDocument> {
        return this.blogsModel
            .findOneAndUpdate(
                { _id: blogId, author: user },
                {
                    'audit.published': pubChange.newStatus,
                    'audit.publishedOn': new Date(),
                },
                { new: true },
            )
            .populate('author');
    }

    /**
     * Toggles a blog post to be fetched as a news post.
     *
     * @param userId
     * @param newsChange
     */
    async toggleNewsPost(userId: string, newsChange: NewsChange): Promise<BlogsContentDocument> {
        return this.blogsModel
            .findOneAndUpdate(
                { _id: newsChange.blogId, author: userId },
                {
                    'audit.isNewsPost': newsChange.postAsNews,
                },
                { new: true },
            )
            .populate('author');
    }

    /**
     * Toggles a blog post to be fetched as a Featured post.
     *
     * @param userId
     * @param featuredChange
     */
    async toggleFeatured(
        userId: string,
        featuredChange: NewsChange,
    ): Promise<BlogsContentDocument> {
        return this.blogsModel
            .findOneAndUpdate(
                { _id: featuredChange.blogId, author: userId },
                {
                    'audit.isFeatured': featuredChange.postAsNews,
                },
                { new: true },
            )
            .populate('author');
    }

    /**
     * Changes a blog's banner image.
     * @param blogId
     * @param authorId
     * @param bannerUrl
     */
    async changeBanner(
        blogId: string,
        authorId: string,
        bannerUrl: string,
    ): Promise<BlogsContentDocument> {
        return this.blogsModel
            .findOneAndUpdate(
                { _id: blogId, author: authorId },
                { 'meta.banner': bannerUrl },
                { new: true },
            )
            .populate('author');
    }
}
