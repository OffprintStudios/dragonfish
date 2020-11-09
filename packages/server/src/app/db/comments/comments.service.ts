import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';

import * as documents from './models';
import * as models from '@pulp-fiction/models/comments';
import { BlogsService } from '../blogs/blogs.service';
import { WorksService } from '../works/works.service';
import { ContentService } from '../content/content.service';
import { isNullOrUndefined } from '../../util';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSourceKind } from '@pulp-fiction/models/notifications';

@Injectable()
export class CommentsService {
    constructor(@InjectModel('Comment') private readonly commentModel: PaginateModel<documents.CommentDocument>,
        @InjectModel('BlogComment') private readonly blogCommentModel: PaginateModel<documents.BlogCommentDocument>,
        @InjectModel('WorkComment') private readonly workCommentModel: PaginateModel<documents.WorkCommentDocument>,
        @InjectModel('ContentComment') private readonly contentCommentModel: PaginateModel<documents.ContentCommentDocument>,
        private readonly blogsService: BlogsService, private readonly worksService: WorksService, 
        private readonly contentService: ContentService, private readonly notificationsService: NotificationsService) {}

    /**
     * Creates a new comment that belongs to a blog.
     * 
     * @param user A user's JWT payload
     * @param blogId The blog the comment belongs to
     * @param commentInfo The comment's info
     */
    async createBlogComment(user: any, blogId: string, commentInfo: models.CreateComment): Promise<documents.BlogCommentDocument> {
        const newComment = new this.blogCommentModel({
            user: user.sub,
            blogId: blogId,
            body: commentInfo.body
        });

        let doc = await newComment.save();
        await this.blogsService.addComment(blogId);

        // Send notification to blog author
        await this.notificationsService.queueNotification({
            sourceId: doc._id,
            sourceKind: NotificationSourceKind.Comment,
            sourceParentId: blogId,
            sourceParentKind: NotificationSourceKind.Blog,
            title: `${user.username} posted a new comment on your blog!` // todo: add in blog title here?
        });

        return doc;
    }

    /**
     * Creates a new comment that belongs to a work.
     * 
     * @param user A user's JWT payload
     * @param workId The work the comment belongs to
     * @param commentInfo The comment's info
     */
    async createWorkComment(user: any, workId: string, commentInfo: models.CreateComment): Promise<documents.WorkCommentDocument> {
        const newComment = new this.workCommentModel({
            user: user.sub,
            workId: workId,
            body: commentInfo.body
        });
        
        let doc = await newComment.save();
        await this.worksService.addComment(workId);

        // Sent notification to work author
        await this.notificationsService.queueNotification({
            sourceId: doc._id,
            sourceKind: NotificationSourceKind.Comment,
            sourceParentId: workId,
            sourceParentKind: NotificationSourceKind.Work,
            title: `${user.username} posted a new comment on one of your works!` // todo: some way to identify the work. IDs? Names?
        })

        return doc;
    }

    /**
     * Creates a new comment that belongs to some content.
     * 
     * @param user A user's JWT payload
     * @param contentId The content the comment belongs to
     * @param commentInfo The comment's info
     */
    async createContentComment(user: any, contentId: string, commentInfo: models.CreateComment): Promise<documents.ContentCommentDocument> {
        const newComment = new this.contentCommentModel({
            user: user.sub,
            contentId: contentId,
            body: commentInfo.body
        });

        let doc = await newComment.save();
        await this.contentService.addComment(contentId);
        return doc;
    }

    /**
     * Grabs the comments belonging to this blog.
     * 
     * @param blogId The blog that these comments belong to
     * @param pageNum The current page
     */
    async getBlogComments(blogId: string, pageNum: number): Promise<PaginateResult<documents.BlogCommentDocument>> {
        return await this.blogCommentModel.paginate({"blogId": blogId}, {
            sort: {"createdAt": 1},
            page: pageNum,
            limit: 25
        });
    }

    /**
     * Grabs the comments belonging to this work.
     * 
     * @param workId The work that these comments belong to
     * @param pageNum The current page
     */
    async getWorkComments(workId: string, pageNum: number): Promise<PaginateResult<documents.WorkCommentDocument>> {
        return await this.workCommentModel.paginate({"workId": workId}, {
            sort: {"createdAt": 1},
            page: pageNum,
            limit: 25
        });
    }

    /**
     * Grabs the comments belonging to this content.
     * 
     * @param contentId The content that these comments belong to
     * @param pageNum The current page
     */
    async getContentComments(contentId: string, pageNum: number): Promise<PaginateResult<documents.ContentCommentDocument>> {
        return await this.contentCommentModel.paginate({"contentId": contentId}, {
            sort: {"createdAt": 1},
            page: pageNum,
            limit: 25
        });
    }

    /**
     * Edits a comment belonging to a user, given its ID.
     * 
     * @param user The owner of the comment
     * @param commentId The comment's ID
     * @param commentInfo The comment's new info
     */
    async editComment(user: any, commentId: string, commentInfo: models.EditComment): Promise<void> {
        const oldComment = await this.commentModel.findById(commentId).where('user').equals(user.sub);
        const oldBody = oldComment.body;

        if (isNullOrUndefined(oldComment)) {
            throw new NotFoundException(`The comment you were trying to edit cannot be found.`);
        } else if (oldComment.audit.canEdit === true) {
            return await this.commentModel.updateOne({'_id': commentId, 'user': user.sub}, {
                'body': await sanitizeHtml(commentInfo.body),
                $push: {
                    'history': {
                        'oldBody': oldBody,
                        'editedOn': new Date()
                    }
                }
            });
        } else {
            throw new UnauthorizedException(`You don't have permission to edit this comment.`);
        }
    }
}
