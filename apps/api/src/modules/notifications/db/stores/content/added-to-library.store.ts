import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddedToLibraryDocument } from '../../schemas';
import { AddedToLibraryJob } from '$shared/models/notifications/jobs';
import { NotificationKind } from '$shared/models/notifications';

@Injectable()
export class AddedToLibraryStore {
    constructor(
        @InjectModel(NotificationKind.AddedToLibrary)
        private readonly addedToLibrary: Model<AddedToLibraryDocument>,
    ) {}

    public async create(job: AddedToLibraryJob): Promise<AddedToLibraryDocument> {
        const newNotification = new this.addedToLibrary({
            recipientId: job.recipientId,
            'contentInfo.contentId': job.contentId,
            'contentInfo.contentTitle': job.contentTitle,
            'contentInfo.contentKind': job.contentKind,
            'addedByInfo.userId': job.addedBy._id,
            'addedByInfo.userTag': job.addedBy.userTag,
            'addedByInfo.userName': job.addedBy.screenName,
        });

        return await newNotification.save();
    }
}
