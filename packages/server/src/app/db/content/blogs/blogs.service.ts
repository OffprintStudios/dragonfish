import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { PaginateModel, PaginateResult, PaginateOptions } from 'mongoose';
import { UsersService } from '../../users/users.service';

import { BlogsContentDocument } from './blogs-content.document';
import { BlogForm, PubChange, PubStatus } from '@pulp-fiction/models/content';
import { sanitizeHtml, stripAllHtml } from '@pulp-fiction/html_sanitizer';
import { countPlaintextWords } from '@pulp-fiction/word_counter';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationKind } from '@pulp-fiction/models/notifications';
import { ContentFilter } from '@pulp-fiction/models/works';


@Injectable()
export class BlogsService {
    constructor(@InjectModel('BlogContent') private readonly blogsModel: PaginateModel<BlogsContentDocument>,
        private readonly usersService: UsersService,
        private readonly notificationsService: NotificationsService) {}

    /**
     * Creates a new blogpost and saves it to the database. Returns the newly
     * created blog as a promise.
     *
     * @param user The user making the blog.
     * @param blogInfo The blog's information.
     */  
    async createNewBlog(user: JwtPayload, blogInfo: BlogForm): Promise<BlogsContentDocument> {
        const newBlog = new this.blogsModel({
            'author': user.sub,
            'title': await sanitizeHtml(blogInfo.title),
            'body': await sanitizeHtml(blogInfo.body),
            'meta.rating': blogInfo.rating,
            'stats.words': await countPlaintextWords(await stripAllHtml(blogInfo.body))
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
        const wordcount = await countPlaintextWords(await stripAllHtml(blogInfo.body));

        return await this.blogsModel.findOneAndUpdate({'_id': blogId, 'author': user.sub}, {
            'title': await sanitizeHtml(blogInfo.title),
            'body': await sanitizeHtml(blogInfo.body),
            'meta.rating': blogInfo.rating,
            'stats.words': wordcount
        }, {new: true});
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

        return await this.blogsModel.findOneAndUpdate({'_id': blogId, 'author': user.sub}, {
            'audit.published': pubChange.newStatus,
            'audit.publishedOn': new Date()
        }, {new: true});
    }
}
