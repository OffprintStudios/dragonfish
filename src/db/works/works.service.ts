import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as models from './models';
import { UsersService } from '../users/users.service';
import { SearchParameters } from '../../api/search/models/search-parameters';
import { SearchResults } from '../../api/search/models/search-results';
import { isNullOrUndefined } from 'util';

@Injectable()
export class WorksService {
    constructor(
        @InjectModel('Work') private readonly workModel: Model<models.Work>,
        @InjectModel('Section') private readonly sectionModel: Model<models.Section>,
        private readonly usersService: UsersService) {}
    
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
            title: newWorkInfo.title,
            shortDesc: newWorkInfo.shortDesc,
            longDesc: newWorkInfo.longDesc,
            meta: {
                category: newWorkInfo.category,
                fandoms: newWorkInfo.fandoms,
                genres: newWorkInfo.genres,
                rating: newWorkInfo.rating,
                status: newWorkInfo.status,
            },
        });

        return await newWork.save().then(async work => {
            const workCount = await this.workModel.countDocuments({author: user.sub});
            await this.usersService.updateWorkCount(user.sub, workCount);
            return work;
        });
    }

    /**
     * Creates a new section and adds it to the database, updating the associated work's
     * array of sections. Returns the newly created section as a promise.
     * 
     * @param workId The work this section is being added to.
     * @param newSectionInfo The section's information.
     */
    async createNewSection(user: any, workId: string, newSectionInfo: models.CreateSection): Promise<models.Section> {
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub });

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const newSection = new this.sectionModel({
                title: newSectionInfo.title,
                body: newSectionInfo.body,
                authorsNote: newSectionInfo.authorsNote,
            });

            return await newSection.save().then(async section => {
                await this.workModel.findByIdAndUpdate(workId, {$push: {"sections": section._id}});
                return section;
            });
        }
    }

    /**
     * Looks up a work by its ID and returns it.
     * 
     * @param workId The work you're trying to find.
     */
    async findOneWorkById(workId: string): Promise<models.Work> {
        return await this.workModel.findById(workId).where('audit.isDeleted', false);
    }

    /**
     * Grabs all a user's works and returns them in an array. Used only
     * for a user's own works list.
     * 
     * @param user The user whose works we're fetching.
     */
    async fetchUserWorks(user: any): Promise<models.Work[]> {
        return await this.workModel.find().where('author', user.sub).where('audit.isDeleted', false);
    }

    /**
     * Finds any related works related to a user's query.
     * 
     * @param searchParameters The user's search query
     */
    async findRelatedWorks(searchParameters: SearchParameters): Promise<SearchResults<models.Work> | null> {
        const p = searchParameters.pagination;
        const filter: FilterQuery<models.Work> = {
            $text: {$search: searchParameters.text},
            'audit.published': true,
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
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub, "sections": sectionId });

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const section = await this.sectionModel.findById(sectionId);
            return section;
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
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub, "sections": sectionId});

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const updatedSection = {
                title: sectionInfo.title,
                body: sectionInfo.body,
                authorsNote: sectionInfo.authorsNote,
                published: sectionInfo.published
            };

            return await this.sectionModel.findOneAndUpdate({ "_id": sectionId }, updatedSection).then(async sec => {
                if (sec.published === true && sectionInfo.oldPublished === false) { // if newly published
                    await this.workModel.findByIdAndUpdate(thisWork._id, {$inc: {"stats.totWords": sec.stats.words}});
                } else if (sec.published === false && sectionInfo.oldPublished === true) { // if unpublished
                    await this.workModel.findByIdAndUpdate(thisWork._id, {$inc: {"stats.totWords": -sectionInfo.oldWords}});
                } else if (sec.published === true && sectionInfo.oldPublished === true) { // publish status didn't change
                    await this.workModel.findByIdAndUpdate(thisWork._id, {$inc: {"stats.totWords": -sectionInfo.oldWords}}).then(async () => {
                        await this.workModel.findByIdAndUpdate(thisWork._id, {$inc: {"stats.totWords": sec.stats.words}});
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
        const thisWork = await this.workModel.findOne({ "_id": workId, "author": user.sub, "sections": sectionId});

        if (isNullOrUndefined(thisWork)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            return await this.sectionModel.findOneAndUpdate({ "_id": sectionId }, { "published": pubStatus.newPub }).then(async sec => {
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
        await this.workModel.findOneAndUpdate({"_id": workId, "author": user.sub}, {"audit.isDeleted": true}).then(async () => {
            const workCount = await this.workModel.countDocuments({author: user.sub}).where('audit.isDeleted', false).where('published', true);
            await this.usersService.updateWorkCount(user.sub, workCount);
        });
    }

    /**
     * Edit's a given user's work with the provided work information.
     * 
     * @param user The author of the work
     * @param workInfo The work we're modifying
     */
    async editWork(user: any, workInfo: models.EditWork): Promise<void> {
        await this.workModel.findOneAndUpdate({"_id": workInfo._id, "author": user.sub}, {
            title: workInfo.title,
            shortDesc: workInfo.shortDesc,
            longDesc: workInfo.longDesc,
            meta: {
                category: workInfo.category,
                fandoms: workInfo.fandoms,
                genres: workInfo.genres,
                rating: workInfo.rating,
                status: workInfo.status,
            },
        });
    }
}
