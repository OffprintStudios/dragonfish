import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { PaginateModel } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { stripTags, countWords } from 'voca';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { UsersStore } from '../../users/users.store';
import { BlogsContentDocument } from './blogs-content.document';
import { BlogForm, ContentKind, PubChange, PubStatus } from '@dragonfish/shared/models/content';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationKind } from '@dragonfish/shared/models/notifications';
import { MigrationForm } from '@dragonfish/shared/models/migration';

@Injectable()
export class BlogsStore {
    constructor(
        @InjectModel('BlogContent') private readonly blogsModel: PaginateModel<BlogsContentDocument>,
        private readonly usersService: UsersStore, private readonly notificationsService: NotificationsService,
    ) {}

    /**
     * Creates a new blogpost and saves it to the database. Returns the newly
     * created blog as a promise.
     *
     * @param user The user making the blog.
     * @param blogInfo The blog's information.
     */
    async createNewBlog(user: JwtPayload, blogInfo: BlogForm): Promise<BlogsContentDocument> {
        const newBlog = new this.blogsModel({
            author: user.sub,
            title: sanitizeHtml(blogInfo.title),
            body: sanitizeHtml(blogInfo.body, sanitizeOptions),
            'meta.rating': blogInfo.rating,
            'stats.words': countWords(stripTags(sanitizeHtml(blogInfo.body, sanitizeOptions))),
        });

        const savedBlog = await newBlog.save();

        // Subscribe the author to comments on their new blog
        await this.notificationsService.subscribe(user.sub, savedBlog._id, NotificationKind.CommentNotification);

        return savedBlog;
    }

    /**
     * Edits a given user's blog using the provided information in the EditBlog
     * model.
     *
     * @param user The author of the blog
     * @param blogId The blog's ID
     * @param blogInfo The blog info for the update
     */
    async editBlog(user: JwtPayload, blogId: string, blogInfo: BlogForm): Promise<BlogsContentDocument> {
        const wordCount = countWords(stripTags(sanitizeHtml(blogInfo.body, sanitizeOptions)));

        return this.blogsModel.findOneAndUpdate(
            { _id: blogId, author: user.sub },
            {
                title: sanitizeHtml(blogInfo.title),
                body: sanitizeHtml(blogInfo.body, sanitizeOptions),
                'meta.rating': blogInfo.rating,
                'stats.words': wordCount,
            },
            { new: true }
        );
    }

    /**
     * Changes the publishing status of the specified blog. If there was a change in the publishing status,
     * like from true to false, then change the blog count on the specified user accordingly. Otherwise, do
     * nothing.
     *
     * @param user The author of the blog
     * @param blogId The blog's ID
     * @param pubStatus Object for change in publishing status
     */
    async changePublishStatus(user: JwtPayload, blogId: string, pubChange: PubChange): Promise<BlogsContentDocument> {
        if (pubChange.oldStatus === PubStatus.Unpublished && pubChange.newStatus === PubStatus.Published) {
            await this.usersService.changeBlogCount(user, true);
        } else if (pubChange.oldStatus === PubStatus.Published && pubChange.newStatus === PubStatus.Unpublished) {
            await this.usersService.changeBlogCount(user, false);
        }

        return this.blogsModel.findOneAndUpdate(
            { _id: blogId, author: user.sub },
            {
                'audit.published': pubChange.newStatus,
                'audit.publishedOn': new Date(),
            },
            { new: true }
        );
    }

    async migrateBlog(user: JwtPayload, formData: MigrationForm) {
        const newBlog = new this.blogsModel({
            _id: formData._id,
            author: user.sub,
            title: sanitizeHtml(formData.title),
            body: sanitizeHtml(formData.body, sanitizeOptions),
            'meta.rating': formData.meta.rating,
            'meta.warnings': [],
            'stats.words': formData.stats.words,
            'stats.views': formData.stats.views,
            'stats.likes': formData.stats.likes,
            'stats.dislikes': formData.stats.dislikes,
            'stats.comments': formData.stats.comments,
            'audit.published': formData.published,
            'audit.publishedOn': formData.publishedOn,
            'audit.hasComments': true,
            'audit.isDeleted': false,
            kind: ContentKind.BlogContent,
            createdAt: formData.createdAt,
            updatedAt: formData.updatedAt,
        });

        return await newBlog.save();
    }
}
