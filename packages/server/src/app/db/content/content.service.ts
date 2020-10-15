import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { UserInfo } from '@pulp-fiction/models/users';
import { AnyKindOfDictionary } from 'lodash';
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
    async fetchOnePublished(contentId: string, kind: string, user?: JwtPayload) {
        if (kind === 'NewsContent') {
            const post = await this.contentModel.findOne({'_id': contentId, 'kind': kind, 'audit.isDeleted': false, 'audit.published': true});
            if (user) {
                await this.addView(user, (post.author as any)._id, post._id);
                return post;
            } else {
                return post;
            }
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
     * Adds a view to a piece of content.
     * 
     * @param user The user adding the view
     * @param authorId The author of the content
     * @param contentId The content's ID
     */
    private async addView(user: JwtPayload, authorId: string, contentId: string): Promise<void> {
        if (authorId === user.sub) {
            return;
        }

        return await this.contentModel.updateOne({'_id': contentId}, {$inc: {'stats.views': 1}});
    }
}
