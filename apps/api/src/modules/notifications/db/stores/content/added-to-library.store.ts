import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddedToLibraryDocument } from '../../schemas';
import { NotificationKind } from '$shared/models/notifications';
import { AddedToLibraryPackage } from '$shared/models/notifications/packages';

@Injectable()
export class AddedToLibraryStore {
    constructor(
        @InjectModel(NotificationKind.AddedToLibrary)
        private readonly addedToLibrary: Model<AddedToLibraryDocument>,
    ) {}

    public async create(_package: AddedToLibraryPackage): Promise<AddedToLibraryDocument> {
        const newNotification = new this.addedToLibrary({
            recipientId: _package.recipientId,
            'contentInfo.contentId': _package.contentId,
            'contentInfo.contentTitle': _package.contentTitle,
            'contentInfo.contentKind': _package.contentKind,
            'addedByInfo.userId': _package.addedBy._id,
            'addedByInfo.userTag': _package.addedBy.userTag,
            'addedByInfo.userName': _package.addedBy.screenName,
        });

        return await newNotification.save();
    }
}
