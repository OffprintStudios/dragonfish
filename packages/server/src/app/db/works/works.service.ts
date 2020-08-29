import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PaginateModel, PaginateResult } from 'mongoose';
import { countWords } from '@pulp-fiction/word_counter';
import * as sanitize from 'sanitize-html';

import * as models from '@pulp-fiction/models/works';
import * as documents from './models';
import { UsersService } from '../users/users.service';
import { SearchParameters } from '../../api/search/models/search-parameters';
import { SearchResults } from '../../api/search/models/search-results';
import { isNullOrUndefined } from 'util';
import { HistoryService } from '../history/history.service';
import { RatingOption } from '@pulp-fiction/models/history';

@Injectable()
export class WorksService {
    constructor(
        @InjectModel('Work') private readonly workModel: PaginateModel<documents.WorkDocument>,
        @InjectModel('Section') private readonly sectionModel: Model<documents.SectionDocument>,
        private readonly usersService: UsersService, private readonly histService: HistoryService) {}
    
    /* Work and Section creation*/
    
    /**
     * Creates a new work and saves it to the database, updating a user's work count.
     * Returns the newly created work as a promise.
     * 
     * @param user The user making the work.
     * @param newWorkInfo The new work's information.
     */
    async createNewWork(user: any, newWorkInfo: models.CreateWork): Promise<models.Work> {
        const newWork = new this.workModel({
            author: user.sub,
            title: sanitize(newWorkInfo.title),
            shortDesc: sanitize(newWorkInfo.shortDesc),
            longDesc: sanitize(newWorkInfo.longDesc),
            meta: {
                category: newWorkInfo.category,
                fandoms: newWorkInfo.fandoms,
                genres: newWorkInfo.genres,
                rating: newWorkInfo.rating,
                status: newWorkInfo.status,
            },
        });

        return await newWork.save();
    }

    /**
     * Creates a new section and adds it to the database, updating the associated work's
     * array of sections. Returns the newly created section as a promise.
     * 
     * @param workId The work this section is being added to.
     * @param newSectionInfo The section's information.
     */
    async createNewSection(user: any, workId: string, newSectionInfo: models.CreateSection): Promise<models.Section> {
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub }).where("audit.isDeleted", false);

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const newSection = new this.sectionModel({
                title: sanitize(newSectionInfo.title),
                body: sanitize(newSectionInfo.body),
                authorsNote: sanitize(newSectionInfo.authorsNote),
                usesFroala: newSectionInfo.usesFroala                
            });

            return await newSection.save().then(async section => {
                //@ts-ignore
                await this.workModel.findByIdAndUpdate(workId, {$push: {"sections": section._id}}).where("audit.isDeleted", false);
                return section;
            });
        }
    }

    /**
     * Looks up a work by its ID and returns it.
     * 
     * @param workId The work you're trying to find.
     */
    async findOneWorkById(workId: string, user?: any): Promise<models.Work> {
        const thisWork = await this.workModel.findById(workId).where('audit.isDeleted', false);

        if (isNullOrUndefined(thisWork)) {
            throw new NotFoundException(`The work you're looking for doesn't seem to exist.`);
        } else if (thisWork.audit.published === models.ApprovalStatus.Approved) {
            // If approved
            if (user) {
                // If a user is viewing this
                const authorInfo = thisWork.author as models.AuthorInfo;
                if (authorInfo._id === user.sub) {
                    // If the user is the author of this work
                    return thisWork;
                } else {
                    // If the user isn't the author
                    await this.workModel.updateOne({'_id': thisWork._id}, {$inc: {'stats.views': 1}});
                    return thisWork;
                }
            } else {
                // If there is no user viewing this
                await this.workModel.updateOne({'_id': thisWork._id}, {$inc: {'stats.views': 1}});
                return thisWork;
            }
        } else {
            // If the work exists but is not approved
            return thisWork;
        }
    }

    /**
     * Fetches a section belonging to the specified work.
     * 
     * @param workId The work this section belongs to
     * @param sectionId The section itself
     */
    async findOneSectionById(workId: string, sectionId: string): Promise<models.Section> {
        //@ts-ignore
        const thisWork = await this.workModel.findOne({ "_id": workId, "sections": sectionId }).where("audit.isDeleted", false);

        if (isNullOrUndefined(thisWork)) {
            throw new NotFoundException(`Doesn't look like the work you requested exists.`);
        } else {
            return await this.sectionModel.findById(sectionId).where("audit.isDeleted", false).where("published", true);
        }
    }

    /**
     * Grabs all a user's works and returns them in an array. Used only
     * for a user's own works list.
     * 
     * @param user The user whose works we're fetching.
     */
    async fetchUserWorks(user: any, pageNum: number): Promise<PaginateResult<documents.WorkDocument>> {
        return await this.workModel.paginate({'author': user.sub, 'audit.isDeleted': false}, {
            sort: {'createdAt': -1},
            page: pageNum,
            limit: 15
        })
    }

    /**
     * Fetches one work for the Approval Queue.
     * 
     * @param user The author of the work
     * @param workId The work's ID
     */
    async fetchOneUserWorkForQueue(user: any, workId: string) {
        return await this.workModel.findOne({"_id": workId, "author": user.sub}).where("audit.isDeleted", false);
    }

    /**
     * Finds any related works related to a user's query.
     * 
     * @param searchParameters The user's search query
     */
    async findRelatedWorks(searchParameters: SearchParameters): Promise<SearchResults<documents.WorkDocument> | null> {
        const p = searchParameters.pagination;
        const filter: FilterQuery<models.Work> = {
            $text: {$search: searchParameters.text},
            'audit.published': models.ApprovalStatus.Approved,
        };

        const results = await this.workModel.find(filter,
            {
                searchScore: {$meta: 'textScore'}
            }).sort({score: {$meta: 'textScore'}})
            .sort({'stats.views': -1})
            .skip((p.page - 1) * p.pageSize)
            .limit(p.pageSize);

        if (results.length === 0 && p.page !== 1) {
            return null;
        } else {
            const totalPages = Math.ceil(
                await this.workModel.count(filter) / p.pageSize // God, we should probably cache this stuff.
            );
            return {
                matches: results,
                totalPages: totalPages,
                pagination: searchParameters.pagination
            };
        }
    }

    /**
     * Retrieves a section of a work owned by the specified author.
     * 
     * @param user The author of the work
     * @param workId The section this work belongs to
     * @param sectionId The section ID
     */
    async getSectionForUser(user: any, workId: string, sectionId: string): Promise<models.Section> {
        //@ts-ignore
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub, "sections": sectionId }).where("audit.isDeleted", false);

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            return await this.sectionModel.findById(sectionId).where("audit.isDeleted", false);
        }
    }

    /**
     * Updates a section with the provided edits.
     * 
     * @param user The author of the work
     * @param workId The work the section belongs to
     * @param sectionId The section itself
     * @param sectionInfo The new section information
     */
    async editSection(user: any, workId: string, sectionId: string, sectionInfo: models.EditSection): Promise<models.Section> {
        //@ts-ignore
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub, "sections": sectionId}).where("audit.isDeleted", false);

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {        
            return await this.sectionModel.findOneAndUpdate({ "_id": sectionId }, {
                "title": sanitize(sectionInfo.title),
                "body": sanitize(sectionInfo.body, {  
                    allowedAttributes: {
                        'p': ["style"],
                    },
                    allowedStyles: {
                        '*': {
                            // Match HEX and RGB
                            'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
                            'text-align': [/^left$/, /^right$/, /^center$/],
                            // Match any number with px, em, or %
                            'font-size': [/^\d+(?:px|em|%)$/]
                        },
                        'p': {
                            'font-size': [/^\d+rem$/]
                        }
                    }
                }),
                "authorsNote": sanitize(sectionInfo.authorsNote),                
                "stats.words": sectionInfo.usesFroala 
                    ? 3 // TODO: Make this return a real value
                    : await countWords(sanitize(sectionInfo.body)),
                "usesFroala": sectionInfo.usesFroala
            }, {new: true}).then(async sec => {
                if (sec.published === true) {
                    await this.workModel.updateOne({ "_id": thisWork._id}, {$inc: {"stats.totWords": -sectionInfo.oldWords}}).then(async () => {
                        await this.workModel.updateOne({ "_id": thisWork._id}, {$inc: {"stats.totWords": sec.stats.words}});
                    });
                }
                return sec;
            });
        }
    }

    /**
     * Sets the status of a section to the specified publishing status.
     * 
     * @param user The author of the work
     * @param workId The work the section belongs to
     * @param sectionId The section itself
     * @param pubStatus The new section publishing status
     */
    async publishSection(user: any, workId: string, sectionId: string, pubStatus: models.PublishSection) {
        //@ts-ignore
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub, "sections": sectionId}).where("audit.isDeleted", false);

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            return await this.sectionModel.findOneAndUpdate({ "_id": sectionId }, { "published": pubStatus.newPub }, {new: true}).where("audit.isDeleted", false).then(async sec => {
                if (sec.published === true && pubStatus.oldPub === false) { // if newly published
                    await this.workModel.findByIdAndUpdate(thisWork._id, {$inc: {"stats.totWords": sec.stats.words}});
                } else if (sec.published === false && pubStatus.oldPub === true) { // if unpublished
                    await this.workModel.findByIdAndUpdate(thisWork._id, {$inc: {"stats.totWords": -sec.stats.words}});
                }
                return sec;
            });
        }
    }

    /**
     * Sets the isDeleted flag of a work to true to perform a soft deletion. Then, updates
     * the count of published works on the user's document.
     * 
     * @param user The author of the work
     * @param workId The work we're deleting
     */
    async deleteWork(user: any, workId: string): Promise<void> {
        await this.workModel.findOneAndUpdate({"_id": workId, "author": user.sub}, {"audit.isDeleted": true});
        const workCount = await this.getWorkCount(user.sub);
        await this.usersService.updateWorkCount(user.sub, workCount);
    }

    /**
     * Sets the isDeleted flag of a section to true to perform a soft deletion. Then, updates the
     * total word count of the work it beloged to.
     * 
     * @param user The author of the work
     * @param workId The work the section belongs to
     * @param sectionId The section itself
     */
    async deleteSection(user: any, workId: string, sectionId: string): Promise<void> {
        //@ts-ignore
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub, "sections": sectionId}).where("audit.isDeleted", false);

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            await this.sectionModel.findOneAndUpdate({"_id": sectionId}, {"audit.isDeleted": true}, {new: true}).then(async sec => {
                if (sec.published === true) {
                    await this.workModel.updateOne({"_id": workId}, {$inc: {"stats.totWords": -sec.stats.words}}).where("audit.isDeleted", false);
                }
            });
        }
    }

    /**
     * Edit's a given user's work with the provided work information.
     * 
     * @param user The author of the work
     * @param workInfo The work we're modifying
     */
    async editWork(user: any, workInfo: models.EditWork): Promise<void> {
        await this.workModel.updateOne({"_id": workInfo._id, "author": user.sub}, {
            'title': workInfo.title,
            'shortDesc': workInfo.shortDesc,
            'longDesc': workInfo.longDesc,
            'meta.category': workInfo.category,
            'meta.fandoms': workInfo.fandoms,
            'meta.genres': workInfo.genres,
            'meta.rating': workInfo.rating,
            'meta.status': workInfo.status,
        }).where("audit.isDeleted", false);
    }

    /**
     * Sets the approval status of a work to Approved.
     * 
     * @param workId The work to approve
     * @param authorId The author of the work
     */
    async approveWork(workId: string, authorId: string): Promise<void> {
        //@ts-ignore
        await this.workModel.updateOne({"_id": workId, "author": authorId}, {"audit.published": models.ApprovalStatus.Approved, "audit.publishedOn": new Date()})
            .where("audit.isDeleted", false);
        const workCount = await this.getWorkCount(authorId);
        await this.usersService.updateWorkCount(authorId, workCount);
    }

    /**
     * Sets the approval status of a work to Rejected.
     * 
     * @param workId The work to reject
     * @param authorId The author of the work
     */
    async rejectWork(workId: string, authorId: string): Promise<void> {
        //@ts-ignore
        await this.workModel.updateOne({"_id": workId, "author": authorId}, {"audit.published": models.ApprovalStatus.Rejected}).where("audit.isDeleted", false);
    }

    /**
     * Sets the approval status of a work to Pending.
     * 
     * @param workId The work to set to pending
     * @param authorId The author of the work
     */
    async pendingWork(workId: string, authorId: string): Promise<void> {
        //@ts-ignore
        await this.workModel.updateOne({"_id": workId, "author": authorId}, {"audit.published": models.ApprovalStatus.Pending}).where("audit.isDeleted", false);
    }

    /**
     * Updates the coverart of the specified work.
     * 
     * @param user The author of the work
     * @param coverArt The new cover art
     * @param workId The work's ID
     */
    async updateCoverArt(user: any, coverArt: string, workId: string): Promise<models.Work> {
        return await this.workModel.findOneAndUpdate({ "_id": workId, "author": user.sub }, {"meta.coverArt": coverArt}, {new: true}).where("audit.isDeleted", false);
    }

    /**
     * Fetches all new published works by newest first.
     */
    async fetchNewPublishedWorks(pageNum: number): Promise<PaginateResult<documents.WorkDocument>> {
        return await this.workModel.paginate({'audit.published': models.ApprovalStatus.Approved, 'audit.isDeleted': false}, {
            sort: {'audit.publishedOn': -1},
            page: pageNum,
            limit: 15
        });
    }

    /**
     * Grabs a list of all works by this user.
     * 
     * @param userId The user whose works we're fetching
     */
    async getWorksList(userId: any, pageNum: number): Promise<PaginateResult<documents.WorkDocument>> {
        return await this.workModel.paginate({'author': userId, 'audit.published': models.ApprovalStatus.Approved, 'audit.isDeleted': false}, {
            sort: {'audit.publishedOn': -1},
            page: pageNum,
            limit: 15
        });
    }

    /**
     * Gets the count of published, non-deleted works from the db.
     */
    async getWorkCount(authorId: string): Promise<number> {
        //@ts-ignore
        return await this.workModel.countDocuments({author: authorId})
            .where("audit.isDeleted", false)
            .where('audit.published', models.ApprovalStatus.Approved);
    }

    /**
     * Gets an estimated count of _all_ non-deleted works, included upublished works.
     */
    async getTotalWorkCount(): Promise<number> {
        return await this.workModel.countDocuments()
            .where("audit.published", models.ApprovalStatus.Approved)
            .where("audit.isDeleted", false);
    }

    /**
     * Changes the rating of a user to a Like.
     * 
     * @param userId The user making the change
     * @param workId The work in question
     * @param oldRatingOption A user's old rating option
     */
    async setLike(userId: string, workId: string, oldRatingOption: RatingOption) {
        if (oldRatingOption === RatingOption.Disliked) {
            // If the old rating option was a dislike
            await this.workModel.updateOne({'_id': workId}, {$inc: {'stats.likes': 1}})
                .where('audit.published').equals(models.ApprovalStatus.Approved).then(async () => {
                    await this.histService.setLike(userId, workId);
                });

            await this.workModel.updateOne({'_id': workId}, {$inc: {'stats.dislikes': -1}})
                .where('audit.published').equals(models.ApprovalStatus.Approved);

        } else if (oldRatingOption === RatingOption.Liked) {
            // If the old rating option was already a like
            throw new ConflictException(`You've already upvoted this work!`);
        } else {
            await this.workModel.updateOne({'_id': workId}, {$inc: {'stats.likes': 1}})
                .where('audit.published').equals(models.ApprovalStatus.Approved).then(async () => {
                    await this.histService.setLike(userId, workId);
                });
        }
    }

    /**
     * Changes the rating of a user to a Dislike
     * 
     * @param userId The user making the change
     * @param workId The work in question
     * @param oldRatingOption A user's old rating option
     */
    async setDislike(userId: string, workId: string, oldRatingOption: RatingOption) {
        if (oldRatingOption === RatingOption.Liked) {
            // If the old rating option was a like
            await this.workModel.updateOne({'_id': workId}, {$inc: {'stats.dislikes': 1}})
                .where('audit.published').equals(models.ApprovalStatus.Approved).then(async () => {
                    await this.histService.setDislike(userId, workId);
                });

            await this.workModel.updateOne({'_id': workId}, {$inc: {'stats.likes': -1}})
                .where('audit.published').equals(models.ApprovalStatus.Approved);

        } else if (oldRatingOption === RatingOption.Disliked) {
            // If the old rating option was already a dislike
            throw new ConflictException(`You've already downvoted this work!`);
        } else {
            await this.workModel.updateOne({'_id': workId}, {$inc: {'stats.dislikes': 1}})
                .where('audit.published').equals(models.ApprovalStatus.Approved).then(async () => {
                    await this.histService.setDislike(userId, workId);
                });
        }
    }

    /**
     * Changes the rating of a user to NoVote
     * 
     * @param userId The user making the change
     * @param workId The work in question
     * @param oldRatingOption A user's old rating option
     */
    async setNoVote(userId: string, workId: string, oldRatingOption: RatingOption) {
        if (oldRatingOption === RatingOption.Liked) {
            // If the old rating option was a like
            await this.workModel.updateOne({'_id': workId}, {$inc: {'stats.likes': -1}})
                .where('audit.published').equals(models.ApprovalStatus.Approved).then(async () => {
                    await this.histService.setNoVote(userId, workId);
                });
        } else if (oldRatingOption === RatingOption.Disliked) {
            // If the old rating option was a dislike
            await this.workModel.updateOne({'_id': workId}, {$inc: {'stats.dislikes': -1}})
                .where('audit.published').equals(models.ApprovalStatus.Approved).then(async () => {
                    await this.histService.setNoVote(userId, workId);
                });
        }
    }
}
