import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentCommentDocument } from '../../schemas';
import { NotificationKind } from '$shared/models/notifications';
import { ContentCommentDbPayload } from '$shared/models/notifications/db-payloads';

@Injectable()
export class ContentCommentStore {
    constructor(
        @InjectModel(NotificationKind.ContentComment)
        private readonly contentComment: Model<ContentCommentDocument>,
    ) {}

    public async create(payload: ContentCommentDbPayload): Promise<ContentCommentDocument> {
        const newNotification = new this.contentComment({
            recipientId: payload.recipientId,
            'commentInfo.commentId': payload.commentId,
            'commentInfo.posterName': payload.poster.name,
            'commentInfo.posterId': payload.poster.id,
            'commentInfo.posterTag': payload.poster.tag,
            'contentInfo.contentId': payload.content.id,
            'contentInfo.contentTitle': payload.content.title,
            'contentInfo.contentKind': payload.content.kind,
        });

        return await newNotification.save();
    }
}
