import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RatingsDocument } from './ratings.schema';
import { JwtPayload } from '@dragonfish/shared/models/auth';

@Injectable()
export class RatingsStore {
    constructor(@InjectModel('Ratings') private readonly ratings: Model<RatingsDocument>) {}

    public async createRatingsDoc(contentId: string) {
        const newDoc = new this.ratings({
            _id: contentId,
        });

        return newDoc.save();
    }

    public async addLike(user: JwtPayload, contentId: string) {
        const doc = await this.ratings.findById(contentId);
        if (doc.likes.some((value) => value === user.sub)) {
            throw new ConflictException(`You already up-voted this content!`);
        }
        if (doc.dislikes.some((value) => value === user.sub)) {
            doc.dislikes = doc.dislikes.filter((value) => { return value !== user.sub });
        }
        doc.likes = [...doc.likes, user.sub];
        return doc.save();
    }

    public async addDislike(user: JwtPayload, contentId: string) {
        const doc = await this.ratings.findById(contentId);
        if (doc.dislikes.some((value) => value === user.sub)) {
            throw new ConflictException(`You already down-voted this content!`);
        }
        if (doc.likes.some((value) => value === user.sub)) {
            doc.likes = doc.likes.filter((value) => { return value !== user.sub });
        }
        doc.dislikes = [...doc.dislikes, user.sub];
        return doc.save();
    }

    public async removeVote(user: JwtPayload, contentId: string) {
        const doc = await this.ratings.findById(contentId);
        if (doc.likes.some((value) => value === user.sub)) {
            doc.likes = doc.likes.filter((value) => { return value !== user.sub });
        }
        if (doc.dislikes.some((value) => value === user.sub)) {
            doc.dislikes = doc.dislikes.filter((value) => { return value !== user.sub });
        }
        return doc.save();
    }
}
