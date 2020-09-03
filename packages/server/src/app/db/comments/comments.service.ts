import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';

import * as documents from './models';
import * as models from '@pulp-fiction/models/comments';
import { BlogsService } from '../blogs/blogs.service';
import { WorksService } from '../works/works.service';
import { isNullOrUndefined } from '../../util';

@Injectable()
export class CommentsService {
    constructor(@InjectModel('Comment') private readonly commentModel: PaginateModel<documents.CommentDocument>,
        @InjectModel('BlogComment') private readonly blogCommentModel: PaginateModel<documents.BlogCommentDocument>,
        @InjectModel('WorkComment') private readonly workCommentModel: PaginateModel<documents.WorkCommentDocument>,
        private readonly blogsService: BlogsService, private readonly worksService: WorksService) {}

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

        return await newComment.save().then(async doc => {
            await this.blogsService.addComment(blogId);
            return doc;
        });
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

        return await newComment.save().then(async doc => {
            await this.worksService.addComment(workId);
            return doc;
        });
    }

    /**
     * Grabs the comments belonging to this blog.
     * 
     * @param blogId The blog that these comments belong to
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
     */
    async getWorkComments(workId: string, pageNum: number): Promise<PaginateResult<documents.WorkCommentDocument>> {
        return await this.workCommentModel.paginate({"workId": workId}, {
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
