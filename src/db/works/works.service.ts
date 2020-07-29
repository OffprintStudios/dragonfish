import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as models from './models';
import { UsersService } from '../users/users.service';

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
    async createNewSection(workId: string, newSectionInfo: models.CreateSection): Promise<models.Section> {
        const newSection = new this.sectionModel({
            title: newSectionInfo.title,
            body: newSectionInfo.body,
            authorsNote: newSectionInfo.authorsNote,
            published: newSectionInfo.published,
        });

        return await newSection.save().then(async section => {
            await this.workModel.findByIdAndUpdate(workId, {$push: {"sections": section._id}});
            return section;
        });
    }

    /* Work and Section retrieval */

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
