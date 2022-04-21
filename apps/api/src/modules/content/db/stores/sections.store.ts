import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SectionForm, PublishSection } from '$shared/models/sections';
import { SectionsDocument } from '../schemas';

@Injectable()
export class SectionsStore {
    constructor(@InjectModel('Sections') private readonly sectionModel: Model<SectionsDocument>) {}

    /**
     * Creates a new section and adds it to the database, updating the associated work's
     * array of sections. Returns the newly created section as a promise.
     *
     * @param contentId
     * @param sectionInfo The new section's info
     */
    async createNewSection(contentId: string, sectionInfo: SectionForm): Promise<SectionsDocument> {
        const newSection = new this.sectionModel({
            contentId: contentId,
            title: sectionInfo.title,
            body: sectionInfo.body,
            authorsNote: sectionInfo.authorsNote,
            authorsNotePos: sectionInfo.authorsNotePos,
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
            return this.sectionModel.findOneAndUpdate(
                { _id: sectionId },
                { published: pubStatus.newPub, 'audit.publishedOn': new Date() },
                { new: true },
            );
        } else {
            return this.sectionModel.findByIdAndUpdate(
                { _id: sectionId },
                { published: pubStatus.newPub },
                { new: true },
            );
        }
    }

    /**
     * Updates the `publishedOn` date of the specified section.
     * @param sectionId
     * @param date
     */
    async updatePublishedOnDate(sectionId: string, date: Date): Promise<SectionsDocument> {
        return this.sectionModel.findOneAndUpdate(
            { _id: sectionId, published: true },
            { 'audit.publishedOn': date },
            { new: true },
        );
    }

    /**
     * Deletes a given section based on its ID by setting its `isDeleted` field to true.
     *
     * @param sectionId The section ID
     */
    async deleteSection(sectionId: string): Promise<SectionsDocument> {
        return this.sectionModel.findOneAndUpdate(
            { _id: sectionId },
            { 'audit.isDeleted': true },
            { new: true },
        );
    }
}
