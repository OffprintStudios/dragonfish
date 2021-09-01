import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { countWords, stripTags } from 'voca';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { CreatePoetry } from '@dragonfish/shared/models/content';
import { NotificationKind } from '@dragonfish/shared/models/notifications';
import { PoetryContentDocument } from '../schemas';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class PoetryStore {
    constructor(
        @InjectModel('PoetryContent')
        private readonly poetryModel: PaginateModel<PoetryContentDocument>,
        private readonly notificationsService: NotificationsService,
    ) {}

    /**
     * Creates a new work of poetry for the provided author given `poetryInfo` and adds it to the database.
     *
     * @param user The author of this poetry
     * @param poetryInfo The poetry info
     */
    async createPoetry(user: string, poetryInfo: CreatePoetry): Promise<PoetryContentDocument> {
        const newPoetry = new this.poetryModel({
            author: user,
            title: sanitizeHtml(poetryInfo.title),
            desc: sanitizeHtml(poetryInfo.desc),
            body: sanitizeHtml(poetryInfo.body, sanitizeOptions),
            'stats.words': poetryInfo.collection
                ? 0
                : countWords(stripTags(sanitizeHtml(poetryInfo.body, sanitizeOptions))),
            'meta.category': poetryInfo.category,
            'meta.collection': poetryInfo.collection,
            'meta.form': poetryInfo.form,
            'meta.genres': poetryInfo.genres,
            'meta.rating': poetryInfo.rating,
            'meta.status': poetryInfo.status,
        });

        const savedPoetry: PoetryContentDocument = await newPoetry.save();

        // Subscribe author to comments on their new poetry
        await this.notificationsService.subscribe(user, savedPoetry._id, NotificationKind.CommentNotification);

        return savedPoetry;
    }

    /**
     * Saves any changes made to a piece of poetry belonging to the provided user.
     *
     * @param user The author of this poetry
     * @param poetryId The poetry ID
     * @param poetryInfo The poetry info
     */
    async editPoetry(user: string, poetryId: string, poetryInfo: CreatePoetry): Promise<PoetryContentDocument> {
        if (poetryInfo.collection === true) {
            return this.poetryModel.findOneAndUpdate(
                { _id: poetryId, author: user },
                {
                    title: sanitizeHtml(poetryInfo.title),
                    desc: sanitizeHtml(poetryInfo.desc),
                    body: sanitizeHtml(poetryInfo.body, sanitizeOptions),
                    'meta.category': poetryInfo.category,
                    'meta.form': poetryInfo.form,
                    'meta.genres': poetryInfo.genres,
                    'meta.rating': poetryInfo.rating,
                    'meta.status': poetryInfo.status,
                },
                { new: true },
            );
        } else {
            return this.poetryModel.findOneAndUpdate(
                { _id: poetryId, author: user },
                {
                    title: sanitizeHtml(poetryInfo.title),
                    desc: sanitizeHtml(poetryInfo.desc),
                    body: sanitizeHtml(poetryInfo.body, sanitizeOptions),
                    'stats.words': countWords(stripTags(sanitizeHtml(poetryInfo.body, sanitizeOptions))),
                    'meta.category': poetryInfo.category,
                    'meta.form': poetryInfo.form,
                    'meta.genres': poetryInfo.genres,
                    'meta.rating': poetryInfo.rating,
                    'meta.status': poetryInfo.status,
                },
                { new: true },
            );
        }
    }

    /**
     * Updates the cover art of the specified poetry.
     *
     * @param user The author of this poetry
     * @param poetryId The poetry ID
     * @param coverArt The new cover art
     */
    async updateCoverArt(user: string, poetryId: string, coverArt: string): Promise<PoetryContentDocument> {
        return this.poetryModel.findOneAndUpdate(
            { _id: poetryId, author: user, 'audit.isDeleted': false },
            { 'meta.coverArt': coverArt },
            { new: true },
        );
    }
}
