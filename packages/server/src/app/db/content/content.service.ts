import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';

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
     * Fetches one published item from the content collection via ID.
     * 
     * @param contentId A content's ID
     * @param kind A content's Kind
     */
    async fetchOnePublished(contentId: string, kind: string) {
        if (kind === 'NewsContent') {
            return await this.contentModel.find({'_id': contentId, 'kind': kind}).where('audit.isDeleted', false).where('audit.published', true);
        } else if (kind === 'WorkContent') {
            // find work doc
        } else if (kind === 'BlogContent') {
            //find blog doc
        } else {
            throw new BadRequestException(`The designated document kind does not exist.`);
        }
    }

    /**
     * Finds a bunch of content filtered by kind
     * 
     * @param kind The kind of doc
     * @param pageNum The page number to grab
     * @param published Optional parameter, checks whether item needs to be published
     */
    async fetchManyByKind(kind: string, pageNum: number, published?: boolean):  Promise<PaginateResult<ContentDocument>> {
        if (published) {
            if (published === true) {
                if (kind === 'NewsContent') {
                    return await this.contentModel.paginate({'kind': kind, 'audit.published': true, 'audit.isDeleted': false}, {
                        sort: {'audit.publishedOn': -1},
                        page: pageNum,
                        limit: 15
                    });
                } else if (kind === 'WorkContent') {
                    // find work docs
                } else if (kind === 'BlogContent') {
                    // find blog docs
                } else {
                    throw new BadRequestException(`The designated document kind does not exist.`);
                }
            } else {
                return await this.contentModel.paginate({'kind': kind, 'audit.isDeleted': false}, {
                    sort: {'audit.publishedOn': -1},
                    page: pageNum,
                    limit: 15
                });
            }
        } else {
            return await this.contentModel.paginate({'kind': kind, 'audit.isDeleted': false}, {
                sort: {'audit.publishedOn': -1},
                page: pageNum,
                limit: 15
            });
        }
    }
}
