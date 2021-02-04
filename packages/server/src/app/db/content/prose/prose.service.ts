import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';

import { CreateProse } from '@dragonfish/models/content';
import { JwtPayload } from '@dragonfish/models/auth';
import { ProseContentDocument } from './prose-content.document';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationKind } from '@dragonfish/models/notifications';

@Injectable()
export class ProseService {
    constructor(
        @InjectModel('ProseContent') private readonly proseModel: PaginateModel<ProseContentDocument>,
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
            body: sanitizeHtml(proseInfo.body),
            'meta.category': proseInfo.category,
            'meta.genres': proseInfo.genres,
            'meta.rating': proseInfo.rating,
            'meta.status': proseInfo.status,
        });

        const savedProse: ProseContentDocument = await newProse.save();

        // Subscribe author to comments on their new prose document
        this.notificationsService.subscribe(user.sub, savedProse._id, NotificationKind.CommentNotification);

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
        return await this.proseModel.findOneAndUpdate(
            { _id: proseId, author: user.sub },
            {
                title: sanitizeHtml(proseInfo.title),
                desc: sanitizeHtml(proseInfo.desc),
                body: sanitizeHtml(proseInfo.body),
                'meta.category': proseInfo.category,
                'meta.genres': proseInfo.genres,
                'meta.rating': proseInfo.rating,
                'meta.status': proseInfo.status,
            },
            { new: true },
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
        return await this.proseModel.findOneAndUpdate(
            { _id: proseId, author: user.sub, 'audit.isDeleted': false },
            { 'meta.coverArt': coverArt },
            { new: true },
        );
    }
}
