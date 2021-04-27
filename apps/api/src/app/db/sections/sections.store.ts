import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SectionForm, PublishSection } from '@dragonfish/shared/models/sections';
import { SectionsDocument } from './sections.schema';

@Injectable()
export class SectionsStore {
    constructor(@InjectModel('Section') private readonly sectionModel: Model<SectionsDocument>) {}

    /**
     * Creates a new section and adds it to the database, updating the associated work's
     * array of sections. Returns the newly created section as a promise.
     *
     * @param sectionInfo The new section's info
     */
    async createNewSection(sectionInfo: SectionForm): Promise<SectionsDocument> {
        const newSection = new this.sectionModel({
            title: sectionInfo.title,
            body: sectionInfo.body,
            authorsNote: sectionInfo.authorsNote,
            authorsNotePos: sectionInfo.authorsNotePos,

            // Delete this when we're all migrated
            usesNewEditor: sectionInfo.usesNewEditor,
        });

        return await newSection.save();
    }

    /**
     * Updates a section with the provided edits. Returns the updated document.
     *
     * @param sectionId The section ID
     * @param sectionInfo The new section information
     */
    async editSection(sectionId: string, sectionInfo: SectionForm): Promise<SectionsDocument> {
        const thisSection = await this.sectionModel.findById(sectionId);
        thisSection.title = sectionInfo.title;
        thisSection.body = sectionInfo.body;
        thisSection.authorsNote = sectionInfo.authorsNote;
        thisSection.authorsNotePos = sectionInfo.authorsNotePos;
        thisSection.usesNewEditor = sectionInfo.usesNewEditor;

        return await thisSection.save();
    }

    /**
     * Sets a section's publishing status based on `pubStatus`. If true, also sets the publishing date.
     *
     * @param sectionId The section ID
     * @param pubStatus The new pub status
     */
    async publishSection(sectionId: string, pubStatus: PublishSection): Promise<SectionsDocument> {
        if (pubStatus.newPub === true) {
            return await this.sectionModel.findOneAndUpdate(
                { _id: sectionId },
                { published: pubStatus.newPub, 'audit.publishedOn': new Date() },
                { new: true }
            );
        } else {
            return await this.sectionModel.findByIdAndUpdate(
                { _id: sectionId },
                { published: pubStatus.newPub },
                { new: true }
            );
        }
    }

    /**
     * Deletes a given section based on its ID by setting its `isDeleted` field to true.
     *
     * @param sectionId The section ID
     */
    async deleteSection(sectionId: string): Promise<SectionsDocument> {
        return await this.sectionModel.findOneAndUpdate({ _id: sectionId }, { 'audit.isDeleted': true }, { new: true });
    }

    /**
     * Fetches a section by ID. Performs an extra check to only fetch a published section.
     *
     * @param sectionId The second ID
     */
    async fetchSectionById(sectionId: string, published?: boolean): Promise<SectionsDocument> {
        if (published) {
            return await this.sectionModel.findOne({ _id: sectionId, published: true });
        } else {
            return await this.sectionModel.findOne({ _id: sectionId });
        }
    }

    /**
     * Fetches the list of sections belonging to a work, for use with My Stuff routes.
     *
     * @param sectionIds A work's list of sections
     */
    async fetchSectionsList(sectionIds: string[]): Promise<SectionsDocument[]> {
        return await this.sectionModel
            .find({ _id: { $in: sectionIds }, 'audit.isDeleted': false })
            .sort({ createdAt: -1 });
    }
}
