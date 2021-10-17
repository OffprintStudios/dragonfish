import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentCommentDocument } from '../schemas';
import { ContentCommentJob } from '@dragonfish/shared/models/accounts/notifications/jobs';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';

@Injectable()
export class ContentCommentStore {
    constructor(
        @InjectModel(NotificationKind.ContentComment) private readonly contentComment: Model<ContentCommentDocument>,
    ) {}

    public async create(job: ContentCommentJob): Promise<ContentCommentDocument> {
        const newNotification = new this.contentComment({
            recipientId: job.recipientId,
            'commentInfo.commentId': job.commentId,
            'commentInfo.posterName': job.poster.screenName,
            'commentInfo.posterId': job.poster._id,
            'commentInfo.posterTag': job.poster.userTag,
            'contentInfo.contentId': job.contentId,
            'contentInfo.contentTitle': job.contentTitle,
            'contentInfo.contentKind': job.contentKind,
        });

        return await newNotification.save();
    }
}
