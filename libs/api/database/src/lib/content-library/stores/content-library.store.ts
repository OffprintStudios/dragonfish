import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentLibraryDocument } from '../schemas';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { isNullOrUndefined } from '@dragonfish/shared/functions';

@Injectable()
export class ContentLibraryStore {
    constructor(@InjectModel('ContentLibrary') private readonly library: Model<ContentLibraryDocument>) {}

    /**
     * Adds a work to a user's library.
     * @param user
     * @param contentId
     */
    public async addToLibrary(user: JwtPayload, contentId: string): Promise<void> {
        const existingEntry = await this.library.find({ userId: user.sub, content: contentId });

        if (isNullOrUndefined(existingEntry)) {
            const newEntry = new this.library({ userId: user.sub, content: contentId });
            await newEntry.save();
        } else {
            throw new ConflictException(`You've already added this to your library!`);
        }
    }

    /**
     * Removes a work from a user's library.
     * @param user
     * @param contentId
     */
    public async removeFromLibrary(user: JwtPayload, contentId: string) {
        await this.library.remove({ userId: user.sub, content: contentId });
    }

    /**
     * Fetches a user's library.
     * @param user
     */
    public async fetchLibrary(user: JwtPayload) {
        return this.library.find({ userId: user.sub }).sort({ createdAt: -1 });
    }
}
