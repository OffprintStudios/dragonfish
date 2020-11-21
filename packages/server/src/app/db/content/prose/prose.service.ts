import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { CreateProse } from '@pulp-fiction/models/content';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { ProseContentDocument } from './prose-content.document';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';

@Injectable()
export class ProseService {
    constructor(@InjectModel('ProseContent') private readonly proseModel: PaginateModel<ProseContentDocument>) {}

    /**
     * Creates a new work of prose for the provided author given `proseInfo` and adds it to the database.
     * 
     * @param user The author of this prose
     * @param proseInfo The prose info
     */
    async createProse(user: JwtPayload, proseInfo: CreateProse): Promise<ProseContentDocument> {
        const newProse = new this.proseModel({
            'author': user.sub,
            'title': await sanitizeHtml(proseInfo.title),
            'desc': await sanitizeHtml(proseInfo.desc),
            'body': await sanitizeHtml(proseInfo.body),
            'meta.category': proseInfo.category,
            'meta.genres': proseInfo.genres,
            'meta.rating': proseInfo.rating,
            'meta.status': proseInfo.status
        })

        return await newProse.save();
    }

    /**
     * Saves any changes made to a piece of prose belonging to the provided user.
     * 
     * @param user The author of this prose
     * @param proseId The prose ID
     * @param proseInfo The prose info
     */
    async editProse(user: JwtPayload, proseId: string, proseInfo: CreateProse): Promise<ProseContentDocument> {
        return await this.proseModel.findOneAndUpdate({'_id': proseId, 'author': user.sub}, {
            'title': await sanitizeHtml(proseInfo.title),
            'desc': await sanitizeHtml(proseInfo.desc),
            'body': await sanitizeHtml(proseInfo.body),
            'meta.category': proseInfo.category,
            'meta.genres': proseInfo.genres,
            'meta.rating': proseInfo.rating,
            'meta.status': proseInfo.status
        }, {new: true});
    }

    /**
     * Updates the cover art of the specified prose.
     * 
     * @param user The author of this prose
     * @param proseId The prose ID
     * @param coverArt The new cover art
     */
    async updateCoverArt(user: JwtPayload, proseId: string, coverArt: string): Promise<ProseContentDocument> {
        return await this.proseModel.findOneAndUpdate({ "_id": proseId, "author": user.sub, "audit.isDeleted": false}, {"meta.coverArt": coverArt}, {new: true});
    }
}
