import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { ContentKind, PubStatus } from '@pulp-fiction/models/content';
import { Types } from 'mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { isNullOrUndefined } from '../../util';

import { ContentDocument } from './content.schema';

@Injectable()
export class ContentService {
    constructor(@InjectModel('Content') private readonly contentModel: PaginateModel<ContentDocument>) {}

    /**
     * Fetches one unpublished item from the content collection via ID and ContentKind. 
     * 
     * @param contentId A content's ID
     * @param kind A content's Kind
     * @param user The user making this request
     */
    async fetchOne(contentId: string, kind: ContentKind, user: JwtPayload): Promise<ContentDocument> {
        if (kind === ContentKind.ProseContent || kind === ContentKind.PoetryContent) {
            return await this.contentModel.findOne({'_id': contentId, 'author': user.sub, 'kind': kind, 'audit.isDeleted': false}, {autopopulate: false});
        } else {
            return await this.contentModel.findOne({'_id': contentId, 'author': user.sub, 'kind': kind, 'audit.isDeleted': false});
        }
    }

    /**
     * Fetches one published item from the content collection via ID and ContentKind.
     * 
     * @param contentId A content's ID
     * @param kind A content's Kind
     * @param user (Optional) The user making the request
     */
    async fetchOnePublished(contentId: string, kind: ContentKind, user?: JwtPayload): Promise<ContentDocument> {
        const doc = await this.contentModel.findOne({'_id': contentId, 'kind': kind, 'audit.isDeleted': false, 'audit.published': PubStatus.Published});
        if (isNullOrUndefined(user)) {
            await this.incrementViewCount(contentId);
            return doc;
        } else {
            const authorInfo = doc.author as any;
            if (authorInfo._id === user.sub) {
                return doc;
            } else {
                await this.incrementViewCount(contentId);
                return doc;
            }
        }
    }

    /**
     * Finds a bunch of content documents belonging to a user, per that user's
     * request.
     * 
     * @param user The user making the request
     */
    async fetchAll(user: JwtPayload) {
        return await this.contentModel.find({
            'author': user.sub, 
            'audit.isDeleted': false, 
            'kind': {$ne: ContentKind.NewsContent}
        }).sort({'createdAt': 1});
    }

    /**
     * Fetches all published documents based on kind, limited by page number.
     * 
     * @param pageNum The current page
     * @param kind The kind of document to fetch
     */
    async fetchAllPublished(pageNum: number, kind: ContentKind): Promise<PaginateResult<ContentDocument>> {
        let query = {'kind': kind, 'audit.isDeleted': false};
        let paginateOptions = {sort: {'audit.publishedOn': -1}, page: pageNum, limit: 15};
        switch (kind) {
            case ContentKind.BlogContent:
                query['audit.published'] = true;
                break;
            case ContentKind.PoetryContent || ContentKind.ProseContent:
                // change query parameters for works
                break;
            case ContentKind.NewsContent:
                query['audit.published'] = true;
                break;
            default:
                throw new BadRequestException(`The document kind you requested does not exist.`);
        }

        return await this.contentModel.paginate(query, paginateOptions);
    }

    /**
     * Sets the `isDeleted` flag of a piece of content belonging to the specified user to `true`.
     * 
     * @param user The owner fo this content
     * @param contentId The content's ID
     */
    async deleteOne(user: JwtPayload, contentId: string): Promise<void> {
        return await this.contentModel.updateOne({'_id': contentId, 'author': user.sub}, {'audit.isDeleted': true});
    }

    /**
     * Adds a comment to some content.
     * 
     * @param contentId The content's ID
     */
    async addComment(contentId: string) {
        return await this.contentModel.updateOne({"_id": contentId}, {
            $inc: {"stats.comments": 1}
        });
    }

    /**
     * Adds a view to some content.
     * 
     * @param contentId The content's ID
     */
    async incrementViewCount(contentId: string) {
        return await this.contentModel.updateOne({'_id': contentId}, {
            $inc: {'stats.views': 1}
        });
    }

    /**
     * Sets the isChild field of a content document to the value of `isChild`, for folder checks.
     * 
     * @param user The owner of the content
     * @param contentId The content's ID
     */
    async setIsChild(user: JwtPayload, contentId: string, parent: Types.ObjectId) {
        return await this.contentModel.updateOne({'_id': contentId, 'author': user.sub}, {'audit.childOf': parent});
    }
}
