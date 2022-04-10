import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentCommentDocument } from '../../schemas';
import { ContentCommentJob } from '$shared/models/notifications/jobs';
import { NotificationKind } from '$shared/models/notifications';

@Injectable()
export class ContentCommentStore {
    constructor(
        @InjectModel(NotificationKind.ContentComment)
        private readonly contentComment: Model<ContentCommentDocument>,
    ) {}

    public async create(job: ContentCommentJob): Promise<ContentCommentDocument> {
        const newNotification = new this.contentComment({
            recipientId: job.content.author as string,
            'commentInfo.commentId': job.commentId,
            'commentInfo.posterName': job.poster.screenName,
            'commentInfo.posterId': job.poster._id,
            'commentInfo.posterTag': job.poster.userTag,
            'contentInfo.contentId': job.content._id,
            'contentInfo.contentTitle': job.content.title,
            'contentInfo.contentKind': job.content.kind,
        });

        return await newNotification.save();
    }
}
