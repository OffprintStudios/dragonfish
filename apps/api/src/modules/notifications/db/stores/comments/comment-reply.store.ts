import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentReplyDocument } from '../../schemas';
import { CommentReplyDBJob } from '$shared/models/notifications/jobs';
import { NotificationKind } from '$shared/models/notifications';

@Injectable()
export class CommentReplyStore {
    constructor(
        @InjectModel(NotificationKind.CommentReply)
        private readonly commentReply: Model<CommentReplyDocument>,
    ) {}

    public async create(job: CommentReplyDBJob): Promise<CommentReplyDocument> {
        const newNotification = new this.commentReply({
            recipientId: job.recipientId,
            'commentInfo.commentId': job.commentId,
            'commentInfo.posterName': job.poster.screenName,
            'commentInfo.posterId': job.poster._id,
            'commentInfo.posterTag': job.poster.userTag,
            'threadInfo.threadId': job.threadId,
            'threadInfo.threadTitle': job.threadTitle,
        });

        return await newNotification.save();
    }
}
