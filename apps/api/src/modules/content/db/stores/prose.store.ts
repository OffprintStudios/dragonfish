import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '$shared/util';
import { CreateProse } from '$shared/models/content';
import { ProseContentDocument } from '../schemas';

@Injectable()
export class ProseStore {
    constructor(
        @InjectModel('ProseContent')
        private readonly proseModel: PaginateModel<ProseContentDocument>,
    ) {}

    /**
     * Creates a new work of prose for the provided author given `proseInfo` and adds it to the database.
     *
     * @param user The author of this prose
     * @param proseInfo The prose info
     */
    async createProse(user: string, proseInfo: CreateProse): Promise<ProseContentDocument> {
        const newProse = new this.proseModel({
            author: user,
            title: sanitizeHtml(proseInfo.title),
            desc: sanitizeHtml(proseInfo.desc),
            body: sanitizeHtml(proseInfo.body, sanitizeOptions),
            'meta.category': proseInfo.category,
            'meta.genres': proseInfo.genres,
            'meta.rating': proseInfo.rating,
            'meta.status': proseInfo.status,
            tags: proseInfo.tags,
        });

        return await newProse.save();
    }

    /**
     * Saves any changes made to a piece of prose belonging to the provided user.
     *
     * @param user The author of this prose
     * @param proseId The prose ID
     * @param proseInfo The prose info
     */
    async editProse(
        user: string,
        proseId: string,
        proseInfo: CreateProse,
    ): Promise<ProseContentDocument> {
        return this.proseModel
            .findOneAndUpdate(
                { _id: proseId, author: user },
                {
                    title: sanitizeHtml(proseInfo.title),
                    desc: sanitizeHtml(proseInfo.desc),
                    body: sanitizeHtml(proseInfo.body, sanitizeOptions),
                    'meta.category': proseInfo.category,
                    'meta.genres': proseInfo.genres,
                    'meta.rating': proseInfo.rating,
                    'meta.status': proseInfo.status,
                    tags: proseInfo.tags,
                },
                { new: true },
            )
            .populate('author');
    }

    /**
     * Updates the cover art of the specified prose.
     *
     * @param user The author of this prose
     * @param proseId The prose ID
     * @param coverArt The new cover art
     */
    async updateCoverArt(
        user: string,
        proseId: string,
        coverArt: string,
    ): Promise<ProseContentDocument> {
        return this.proseModel
            .findOneAndUpdate(
                { _id: proseId, author: user, 'audit.isDeleted': false },
                { 'meta.coverArt': coverArt },
                { new: true },
            )
            .populate('author');
    }
}
