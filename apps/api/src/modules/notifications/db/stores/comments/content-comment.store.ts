import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentCommentDocument } from '../../schemas';
import { NotificationKind } from '$shared/models/notifications';
import { ContentCommentPackage } from '$shared/models/notifications/packages';

@Injectable()
export class ContentCommentStore {
    constructor(
        @InjectModel(NotificationKind.ContentComment)
        private readonly contentComment: Model<ContentCommentDocument>,
    ) {}

    public async create(_package: ContentCommentPackage): Promise<ContentCommentDocument> {
        const newNotification = new this.contentComment({
            recipientId: _package.recipientId,
            'commentInfo.commentId': _package.commentId,
            'commentInfo.posterName': _package.posterName,
            'commentInfo.posterId': _package.posterId,
            'commentInfo.posterTag': _package.posterTag,
            'contentInfo.contentId': _package.contentId,
            'contentInfo.contentTitle': _package.contentTitle,
            'contentInfo.contentKind': _package.contentKind,
        });

        return await newNotification.save();
    }
}
