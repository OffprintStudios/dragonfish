import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { CreatePoetry } from '@pulp-fiction/models/content';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';
import { PoetryContentDocument } from './poetry-content.document';

@Injectable()
export class PoetryService {
    constructor(@InjectModel('PoetryContent') private readonly poetryModel: PaginateModel<PoetryContentDocument>) {}

    /**
     * Creates a new work of poetry for the provided author given `poetryInfo` and adds it to the database.
     * 
     * @param user The author of this poetry
     * @param poetryInfo The poetry info
     */
    async createProse(user: JwtPayload, poetryInfo: CreatePoetry): Promise<PoetryContentDocument> {
        const newProse = new this.poetryModel({
            'author': user.sub,
            'title': await sanitizeHtml(poetryInfo.title),
            'desc': await sanitizeHtml(poetryInfo.desc),
            'body': await sanitizeHtml(poetryInfo.body),
            'meta.category': poetryInfo.category,
            'meta.genres': poetryInfo.genres,
            'meta.rating': poetryInfo.rating,
            'meta.status': poetryInfo.status
        })

        return await newProse.save();
    }

    /**
     * Saves any changes made to a piece of poetry belonging to the provided user.
     * 
     * @param user The author of this poetry
     * @param poetryId The poetry ID
     * @param poetryInfo The poetry info
     */
    async editProse(user: JwtPayload, poetryId: string, poetryInfo: CreatePoetry): Promise<void> {
        return await this.poetryModel.updateOne({'_id': poetryId, 'author': user.sub}, {
            'title': await sanitizeHtml(poetryInfo.title),
            'desc': await sanitizeHtml(poetryInfo.desc),
            'body': await sanitizeHtml(poetryInfo.body),
            'meta.category': poetryInfo.category,
            'meta.genres': poetryInfo.genres,
            'meta.rating': poetryInfo.rating,
            'meta.status': poetryInfo.status
        });
    }
}
