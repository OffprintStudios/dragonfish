import { Inject, Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { CommentsStore } from '../../db/comments/comments.store';
import { IComments, IContent } from '../../shared/content';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { ContentComment, CreateComment, EditComment } from '@dragonfish/shared/models/comments';
import { CreateCommentNotification, NotificationKind } from '@dragonfish/shared/models/notifications';
import { NotificationsService } from '@dragonfish/api/database/notifications';

@Injectable()
export class CommentsService implements IComments {
    constructor(private readonly comments: CommentsStore,
        private readonly notificationsService: NotificationsService,
        @Inject('IContent') private readonly contentService: IContent) { }

    async get(contentId: string, pageNum: number): Promise<PaginateResult<ContentComment>> {
        return await this.comments.getContentComments(contentId, pageNum);
    }

    async create(user: JwtPayload, contentId: string, commentInfo: CreateComment): Promise<ContentComment> {
        const commentContent = await this.comments.createContentComment(user, contentId, commentInfo);

        // Queue notification for this comment
        const content = (await this.contentService.fetchOnePublished(contentId, commentInfo.commentParentKind));
        const notification: CreateCommentNotification = {
            commentId: commentContent._id,
            kind: NotificationKind.CommentNotification,
            sourceId: contentId,
            creatorUserId: user.sub,
            commenterName: user.username,
            parentKind: commentInfo.commentParentKind,
            parentTitle: content.title,
        };
        await this.notificationsService.queueNotification(notification);



        return commentContent;
    }

    async edit(user: JwtPayload, commentId: string, commentInfo: EditComment): Promise<void> {
        return await this.comments.editComment(user, commentId, commentInfo);
    }
}
