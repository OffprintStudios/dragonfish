import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sanitize from 'sanitize-html';

import * as documents from './models';
import * as models from '@pulp-fiction/models/comments';
import { BlogsService } from '../blogs/blogs.service';
import { WorksService } from '../works/works.service';

@Injectable()
export class CommentsService {
    constructor(@InjectModel('Comment') private readonly commentModel: Model<documents.CommentDocument>,
        @InjectModel('BlogComment') private readonly blogCommentModel: Model<documents.BlogCommentDocument>,
        @InjectModel('WorkComment') private readonly workCommentModel: Model<documents.WorkCommentDocument>,
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

        return await newComment.save();
    }

    /**
     * Grabs the comments belonging to this blog.
     * 
     * @param blogId The blog that these comments belong to
     */
    async getBlogComments(blogId: string): Promise<documents.BlogCommentDocument[]> {
        return await this.blogCommentModel.find().where('blogId').equals(blogId);
    }

    /**
     * Grabs the comments belonging to this work.
     * 
     * @param workId The work that these comments belong to
     */
    async getWorkComments(workId: string): Promise<documents.WorkCommentDocument[]> {
        return await this.workCommentModel.find().where('workId').equals(workId);
    }

    /**
     * Edits a comment belonging to a user, given its ID.
     * 
     * @param user The owner of the comment
     * @param commentId The comment's ID
     * @param commentInfo The comment's new info
     */
    async editComment(user: any, commentId: string, commentInfo: models.EditComment): Promise<void> {
        return await this.commentModel.updateOne({'_id': commentId}, {
            'body': sanitize(commentInfo.body)
        }).where('user').equals(user.sub);
    }
}
