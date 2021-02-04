import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { CreatePoetry } from '@dragonfish/models/content';
import { JwtPayload } from '@dragonfish/models/auth';
import { sanitizeHtml, stripAllHtml } from '@dragonfish/html_sanitizer';
import { NotificationKind } from '@dragonfish/models/notifications';
import { countPlaintextWords } from '@dragonfish/word_counter';

import { PoetryContentDocument } from './poetry-content.document';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class PoetryService {
    constructor(@InjectModel('PoetryContent') private readonly poetryModel: PaginateModel<PoetryContentDocument>,
        private readonly notificationsService: NotificationsService) {}

    /**
     * Creates a new work of poetry for the provided author given `poetryInfo` and adds it to the database.
     * 
     * @param user The author of this poetry
     * @param poetryInfo The poetry info
     */
    async createPoetry(user: JwtPayload, poetryInfo: CreatePoetry): Promise<PoetryContentDocument> {
        const newPoetry = new this.poetryModel({
            'author': user.sub,
            'title': await sanitizeHtml(poetryInfo.title),
            'desc': await sanitizeHtml(poetryInfo.desc),
            'body': await sanitizeHtml(poetryInfo.body),
            'stats.words': poetryInfo.collection ? 0 : await countPlaintextWords(await stripAllHtml(await sanitizeHtml(poetryInfo.body))),
            'meta.category': poetryInfo.category,
            'meta.collection': poetryInfo.collection,
            'meta.form': poetryInfo.form,
            'meta.genres': poetryInfo.genres,
            'meta.rating': poetryInfo.rating,
            'meta.status': poetryInfo.status
        });

        const savedPoetry: PoetryContentDocument = await newPoetry.save();

        // Subscribe author to comments on their new poetry
        this.notificationsService.subscribe(user.sub, savedPoetry._id, NotificationKind.CommentNotification);

        return savedPoetry;
    }

    /**
     * Saves any changes made to a piece of poetry belonging to the provided user.
     * 
     * @param user The author of this poetry
     * @param poetryId The poetry ID
     * @param poetryInfo The poetry info
     */
    async editPoetry(user: JwtPayload, poetryId: string, poetryInfo: CreatePoetry): Promise<PoetryContentDocument> {
        if (poetryInfo.collection === true) {
            return await this.poetryModel.findOneAndUpdate({'_id': poetryId, 'author': user.sub}, {
                'title': await sanitizeHtml(poetryInfo.title),
                'desc': await sanitizeHtml(poetryInfo.desc),
                'body': await sanitizeHtml(poetryInfo.body),
                'meta.category': poetryInfo.category,
                'meta.form': poetryInfo.form,
                'meta.genres': poetryInfo.genres,
                'meta.rating': poetryInfo.rating,
                'meta.status': poetryInfo.status
            }, {new: true});
        } else {
            return await this.poetryModel.findOneAndUpdate({'_id': poetryId, 'author': user.sub}, {
                'title': await sanitizeHtml(poetryInfo.title),
                'desc': await sanitizeHtml(poetryInfo.desc),
                'body': await sanitizeHtml(poetryInfo.body),
                'stats.words': await countPlaintextWords(await stripAllHtml(await sanitizeHtml(poetryInfo.body))),
                'meta.category': poetryInfo.category,
                'meta.form': poetryInfo.form,
                'meta.genres': poetryInfo.genres,
                'meta.rating': poetryInfo.rating,
                'meta.status': poetryInfo.status
            }, {new: true});
        }
    }

    /**
     * Updates the cover art of the specified poetry.
     * 
     * @param user The author of this poetry
     * @param poetryId The poetry ID
     * @param coverArt The new cover art
     */
    async updateCoverArt(user: JwtPayload, poetryId: string, coverArt: string): Promise<PoetryContentDocument> {
        return await this.poetryModel.findOneAndUpdate({ "_id": poetryId, "author": user.sub, "audit.isDeleted": false}, {"meta.coverArt": coverArt}, {new: true});
    }
}
