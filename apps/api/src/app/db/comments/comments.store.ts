import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';

import * as documents from './models';
import * as models from '@dragonfish/shared/models/comments';
import { ContentStore } from '../content/content.store';
import { isNullOrUndefined } from '../../util';
import { CreateCommentNotification, NotificationKind } from '@dragonfish/shared/models/notifications';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsStore {
    constructor(
        @InjectModel('Comment') private readonly commentModel: PaginateModel<documents.CommentDocument>,
        @InjectModel('ContentComment')
        private readonly contentCommentModel: PaginateModel<documents.ContentCommentDocument>,
        private readonly contentService: ContentStore,
        private readonly notificationsService: NotificationsService,
    ) {}

    /**
     * Creates a new comment that belongs to some content.
     *
     * @param user A user's JWT payload
     * @param contentId The content the comment belongs to
     * @param commentInfo The comment's info
     */
    async createContentComment(
        user: any,
        contentId: string,
        commentInfo: models.CreateComment
    ): Promise<documents.ContentCommentDocument> {
        const newComment = new this.contentCommentModel({
            user: user.sub,
            contentId: contentId,
            body: commentInfo.body,
        });

        const doc = await newComment.save();
        await this.contentService.addComment(contentId);

        // const contentTitle = (await this.contentService.fetchOnePublished(contentId, commentInfo.commentParentKind))
        //     .title;
        // const notification: CreateCommentNotification = {
        //     commentId: doc._id,
        //     kind: NotificationKind.CommentNotification,
        //     sourceId: contentId,
        //     commenterId: user.sub,
        //     commenterName: user.username,
        //     parentKind: commentInfo.commentParentKind,
        //     parentTitle: contentTitle,
        // };
        // await this.notificationsService.queueNotification(notification);

        return doc;
    }

    /**
     * Grabs the comments belonging to this content.
     *
     * @param contentId The content that these comments belong to
     * @param pageNum The current page
     */
    async getContentComments(
        contentId: string,
        pageNum: number
    ): Promise<PaginateResult<documents.ContentCommentDocument>> {
        return await this.contentCommentModel.paginate(
            { contentId: contentId },
            {
                sort: { createdAt: 1 },
                page: pageNum,
                limit: 25,
            }
        );
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
            await this.commentModel.updateOne(
                { _id: commentId, user: user.sub },
                {
                    body: sanitizeHtml(commentInfo.body),
                    $push: {
                        history: {
                            oldBody: oldBody,
                            editedOn: new Date(),
                        },
                    },
                }
            );
        } else {
            throw new UnauthorizedException(`You don't have permission to edit this comment.`);
        }
    }
}
