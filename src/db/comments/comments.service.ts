import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as documents from './models';
import * as models from 'shared/models/comments';

@Injectable()
export class CommentsService {
    constructor(@InjectModel('BlogComment') private readonly blogCommentModel: Model<documents.BlogCommentDocument>,
        @InjectModel('WorkComment') private readonly workCommentModel: Model<documents.WorkCommentDocument>) {}

    /**
     * Creates a new comment that belongs to a blog.
     * 
     * @param user A user's JWT payload
     * @param blogId The blog the comment belongs to
     * @param commentInfo The comment's info
     */
    async createBlogComment(user: any, blogId: string, commentInfo: models.CreateComment) {
        const newComment = new this.blogCommentModel({
            user: user.sub,
            blogId: blogId,
            body: commentInfo.body
        });

        return await newComment.save();
    }

    /**
     * Creates a new comment that belongs to a work.
     * 
     * @param user A user's JWT payload
     * @param workId The work the comment belongs to
     * @param commentInfo The comment's info
     */
    async createWorkComment(user: any, workId: string, commentInfo: models.CreateComment) {
        const newComment = new this.workCommentModel({
            user: user.sub,
            workId: workId,
            body: commentInfo.body
        });

        return await newComment.save();
    }
}
