import { Injectable } from '@nestjs/common';
import { CommentStore } from '../db/stores';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentForm, CommentKind } from '$shared/models/comments';
import { ContentCommentPayload } from '$shared/models/notifications/payloads';
import { Pseudonym } from '$shared/models/accounts';
import { NotificationKind } from '$shared/models/notifications';

@Injectable()
export class CommentsService {
    constructor(private readonly store: CommentStore, private readonly events: EventEmitter2) {}

    public async fetchComments(itemId: string, kind: CommentKind, page: number) {
        return this.store.fetch(itemId, kind, page);
    }

    public async createComment(
        pseudId: string,
        itemId: string,
        kind: CommentKind,
        formData: CommentForm,
    ) {
        const newComment = await this.store.create(pseudId, itemId, kind, formData);
        if (kind === CommentKind.ContentComment) {
            const commentEvent: ContentCommentPayload = {
                contentId: itemId,
                commentId: newComment._id,
                repliesTo: newComment.repliesTo,
                posterId: (newComment.user as Pseudonym)._id,
            };
            this.events.emit(NotificationKind.ContentComment, commentEvent);
        }
        return newComment;
    }

    public async editComment(pseudId: string, commentId: string, formData: CommentForm) {
        return this.store.edit(pseudId, commentId, formData);
    }
}
