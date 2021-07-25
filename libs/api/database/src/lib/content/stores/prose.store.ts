import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { ContentKind, ContentModel, CreateProse } from '@dragonfish/shared/models/content';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { ContentDocument, ProseContentDocument } from '../schemas';
import { MigrationForm } from '@dragonfish/shared/models/migration';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationKind } from '@dragonfish/shared/models/notifications';

@Injectable()
export class ProseStore {
    constructor(
        @InjectModel('ProseContent')
        private readonly proseModel: PaginateModel<ProseContentDocument>,
        private readonly notificationsService: NotificationsService,
    ) {}

    /**
     * Creates a new work of prose for the provided author given `proseInfo` and adds it to the database.
     *
     * @param user The author of this prose
     * @param proseInfo The prose info
     */
    async createProse(user: JwtPayload, proseInfo: CreateProse): Promise<ProseContentDocument> {
        const newProse = new this.proseModel({
            author: user.sub,
            title: sanitizeHtml(proseInfo.title),
            desc: sanitizeHtml(proseInfo.desc),
            body: sanitizeHtml(proseInfo.body, sanitizeOptions),
            'meta.category': proseInfo.category,
            'meta.genres': proseInfo.genres,
            'meta.rating': proseInfo.rating,
            'meta.status': proseInfo.status,
        });

        const savedProse: ProseContentDocument = await newProse.save();

        // Subscribe author to comments on their new prose document
        await this.notificationsService.subscribe(user.sub, savedProse._id, NotificationKind.CommentNotification);

        return savedProse;
    }

    /**
     * Saves any changes made to a piece of prose belonging to the provided user.
     *
     * @param user The author of this prose
     * @param proseId The prose ID
     * @param proseInfo The prose info
     */
    async editProse(user: JwtPayload, proseId: string, proseInfo: CreateProse): Promise<ProseContentDocument> {
        return this.proseModel.findOneAndUpdate(
            { _id: proseId, author: user.sub },
            {
                title: sanitizeHtml(proseInfo.title),
                desc: sanitizeHtml(proseInfo.desc),
                body: sanitizeHtml(proseInfo.body, sanitizeOptions),
                'meta.category': proseInfo.category,
                'meta.genres': proseInfo.genres,
                'meta.rating': proseInfo.rating,
                'meta.status': proseInfo.status,
            },
            { new: true }
        );
    }

    /**
     * Updates the cover art of the specified prose.
     *
     * @param user The author of this prose
     * @param proseId The prose ID
     * @param coverArt The new cover art
     */
    async updateCoverArt(user: JwtPayload, proseId: string, coverArt: string): Promise<ProseContentDocument> {
        return this.proseModel.findOneAndUpdate(
            { _id: proseId, author: user.sub, 'audit.isDeleted': false },
            { 'meta.coverArt': coverArt },
            { new: true }
        );
    }

    async migrateWork(user: JwtPayload, formData: MigrationForm) {
        const newProse = new this.proseModel({
            _id: formData._id,
            author: user.sub,
            title: sanitizeHtml(formData.title),
            desc: sanitizeHtml(formData.desc),
            body: sanitizeHtml(formData.body, sanitizeOptions),
            sections: formData.sections,
            'meta.rating': formData.meta.rating,
            'meta.warnings': [],
            'meta.category': formData.meta.category,
            'meta.genres': formData.meta.genres,
            'meta.status': formData.meta.status,
            'meta.coverArt': formData.meta.coverArt,
            'stats.words': formData.stats.words,
            'stats.views': formData.stats.views,
            'stats.likes': formData.stats.likes,
            'stats.dislikes': formData.stats.dislikes,
            'stats.comments': formData.stats.comments,
            'audit.published': formData.published,
            'audit.publishedOn': formData.publishedOn,
            'audit.hasComments': true,
            'audit.isDeleted': false,
            kind: ContentKind.ProseContent,
            createdAt: formData.createdAt,
            updatedAt: formData.updatedAt,
        });

        return await newProse.save();
    }
}
