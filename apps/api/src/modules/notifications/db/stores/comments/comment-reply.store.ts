import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentReplyDocument } from '../../schemas';
import { NotificationKind } from '$shared/models/notifications';
import { CommentReplyPackage } from '$shared/models/notifications/packages';

@Injectable()
export class CommentReplyStore {
    constructor(
        @InjectModel(NotificationKind.CommentReply)
        private readonly commentReply: Model<CommentReplyDocument>,
    ) {}

    public async create(_package: CommentReplyPackage): Promise<CommentReplyDocument> {
        const newNotification = new this.commentReply({
            recipientId: _package.recipientId,
            'commentInfo.commentId': _package.commentId,
            'commentInfo.posterName': _package.poster.screenName,
            'commentInfo.posterId': _package.poster._id,
            'commentInfo.posterTag': _package.poster.userTag,
            'threadInfo.threadId': _package.threadId,
            'threadInfo.threadTitle': _package.threadTitle,
        });

        return await newNotification.save();
    }
}
