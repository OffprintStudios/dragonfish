import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { ContentDocument, SectionsDocument } from '../schemas';
import { ContentFilter, ContentKind, PubStatus } from '@dragonfish/shared/models/content';
import { JwtPayload } from '@dragonfish/shared/models/auth';

/**
 * ## Content Store
 *
 * Functions that aggregate together multiple actions for creating and updating content.
 */
@Injectable()
export class ContentStore {
    constructor(
        @InjectModel('Content') private readonly content: PaginateModel<ContentDocument>,
        @InjectModel('Sections') private readonly sections: Model<SectionsDocument>,
    ) {}

    //#region ---FETCHING---

    /**
     * Fetches one unpublished item from the content collection via ID and ContentKind.
     *
     * @param contentId A content's ID
     * @param kind A content's Kind
     * @param user The user making this request
     */
    async fetchOne(contentId: string, kind: ContentKind, user: JwtPayload): Promise<ContentDocument> {
        if (kind === ContentKind.ProseContent || kind === ContentKind.PoetryContent) {
            return this.content.findOne(
                { _id: contentId, author: user.sub, kind: kind, 'audit.isDeleted': false },
                { autopopulate: false }
            );
        } else {
            return this.content.findOne({
                _id: contentId,
                author: user.sub,
                kind: kind,
                'audit.isDeleted': false,
            });
        }
    }

    /**
     * Fetches a pending work from the database. For use by admins/moderators/work approvers via the dashboard.
     *
     * @param contentId The content ID
     * @param kind The content kind
     * @param userId The owner of the content
     */
    async fetchOnePending(contentId: string, kind: ContentKind, userId: string): Promise<ContentDocument> {
        return this.content.findOne({
            _id: contentId,
            author: userId,
            kind: kind,
            'audit.isDeleted': false,
            'audit.published': PubStatus.Pending,
        });
    }

    /**
     * Fetches a section by ID.
     *
     * @param sectionId The section ID
     */
    async fetchSection(sectionId: string): Promise<SectionsDocument> {
        return this.sections.findOne({ _id: sectionId, 'audit.isDeleted': false });
    }

    //#endregion
}
