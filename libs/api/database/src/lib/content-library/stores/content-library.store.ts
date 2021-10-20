import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentLibraryDocument } from '../schemas';
import { isNullOrUndefined } from '@dragonfish/shared/functions';

@Injectable()
export class ContentLibraryStore {
    constructor(@InjectModel('ContentLibrary') private readonly library: Model<ContentLibraryDocument>) {}

    /**
     * Adds a work to a user's library.
     * @param userId
     * @param contentId
     */
    public async addToLibrary(userId: string, contentId: string): Promise<void> {
        const existingEntry = await this.library.find({ userId: userId, content: contentId });

        if (isNullOrUndefined(existingEntry)) {
            const newEntry = new this.library({ userId: userId, content: contentId });
            await newEntry.save();
        } else {
            throw new ConflictException(`You've already added this to your library!`);
        }
    }

    /**
     * Removes a work from a user's library.
     * @param userId
     * @param contentId
     */
    public async removeFromLibrary(userId: string, contentId: string) {
        await this.library.remove({ userId: userId, content: contentId });
    }

    /**
     * Fetches a user's library.
     * @param userId
     */
    public async fetchLibrary(userId: string) {
        return this.library.find({ userId: userId }).sort({ createdAt: -1 });
    }

    /**
     * Fetches one library doc from the database. As per mongoose defaults, this returns `null` if
     * no doc is found.
     * @param userId
     * @param contentId
     */
    public async fetchOne(userId: string, contentId: string) {
        return this.library.findOne({ userId: userId, content: contentId });
    }
}
