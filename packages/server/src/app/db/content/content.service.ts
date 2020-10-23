import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { ContentKind } from '@pulp-fiction/models/content';
import { PaginateModel, PaginateResult } from 'mongoose';
import { isNullOrUndefined } from '../../util';

import { ContentDocument } from './content.schema';

@Injectable()
export class ContentService {
    constructor(@InjectModel('Content') private readonly contentModel: PaginateModel<ContentDocument>) {}

    /**
     * Fetches one item from the content collection via ID.
     * 
     * @param contentId A content's ID
     */
    async fetchOneUnpublished(contentId: string) {
        return await this.contentModel.findById(contentId).where('audit.isDeleted', false);
    }

    /**
     * Fetches one published item from the content collection via ID and ContentKind. Optionally
     * filters by whether or not the document is published. Also checks to see if a user is making
     * this request, and adds a view where appropriate.
     * 
     * @param contentId A content's ID
     * @param kind A content's Kind
     * @param user (Optional) The user making this request
     * @param isPublished (Optional) Check to determine if the document should be published or not
     */
    async fetchOne(contentId: string, kind: ContentKind, user?: JwtPayload, isPublished?: boolean): Promise<ContentDocument> {
        let query = {'_id': contentId, 'kind': kind, 'audit.isDeleted': false};
        if (isPublished) {
            switch (kind) {
                case ContentKind.BlogContent:
                    query['audit.isPublished'] = true;
                    break;
                case ContentKind.WorkContent:
                    // change query parameters for works
                    break;
                case ContentKind.NewsContent:
                    query['audit.isPublished'] = true;
                    break;
                default: 
                    throw new BadRequestException(`The document kind you requested does not exist.`);
            }
        }
        const doc = await this.contentModel.findOne(query);
        if (isNullOrUndefined(user)) {
            return doc;
        } else {
            const authorInfo = doc.author as any;
            if (authorInfo._id === user.sub) {
                return doc;
            } else {
                await this.addView(contentId);
                return doc;
            }
        }
    }

    /**
     * Finds a bunch of content documents. Can be filtered by kind and whether or not the items need
     * to be published. TIP: Both `kind` and `isPublished` must be set in order for either to work.
     * 
     * @param pageNum The page number to grab
     * @param kind (Optional) Filters by ContentKind
     * @param isPublished (Optional) Checks whether item needs to be published
     * @param user (Optional) Checks to see if you need content owned by a specific user
     */
    async fetchMany(pageNum: number, kind?: ContentKind, isPublished?: boolean, user?: JwtPayload) {
        let query = {'audit.isDeleted': false};
        let paginateOptions = {page: pageNum, limit: 15};

        if (!isNullOrUndefined(kind) && isPublished) {
            switch (kind) {
                case ContentKind.BlogContent:
                    query['kind'] = ContentKind.BlogContent;
                    query['audit.isPublished'] = true;
                    break;
                case ContentKind.WorkContent:
                    // change query parameters for works
                    break;
                case ContentKind.NewsContent:
                    query['kind'] = ContentKind.NewsContent;
                    query['audit.isPublished'] = true;
                    break;
                default: 
                    throw new BadRequestException(`The document kind you requested does not exist.`);
            }
        }

        if (user) {
            query['author'] = user.sub;
        }

        return await this.contentModel.find(query, paginateOptions);
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
    async addView(contentId: string) {
        return await this.contentModel.updateOne({'_id': contentId}, {
            $inc: {'stats.views': 1}
        });
    }
}
