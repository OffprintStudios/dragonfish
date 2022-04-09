import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { ContentDocument, ProseContentDocument, SectionsDocument } from '../schemas';
import {
    BlogForm,
    ContentKind,
    CreatePoetry,
    CreateProse,
    FormType,
    PubStatus,
} from '$shared/models/content';
import { PublishSection, Section, SectionForm } from '$shared/models/sections';
import { BlogsStore } from './blogs.store';
import { ProseStore } from './prose.store';
import { PoetryStore } from './poetry.store';
import { SectionsStore } from './sections.store';

/**
 * ## Content Store
 *
 * Functions that aggregate together multiple actions for creating and updating content.
 */
@Injectable()
export class ContentStore {
    readonly NEWEST_FIRST = -1;

    constructor(
        @InjectModel('Content') private readonly content: PaginateModel<ContentDocument>,
        @InjectModel('Sections') private readonly sections: Model<SectionsDocument>,
        private readonly blogContent: BlogsStore,
        private readonly proseContent: ProseStore,
        private readonly poetryContent: PoetryStore,
        private readonly sectionsStore: SectionsStore,
    ) {}

    //#region ---FETCHING---

    /**
     * Fetches one item from the content collection via ID.
     * @param contentId A content's ID
     * @param user The user making this request
     * @param populate Whether or not to autopopulate the request
     */
    async fetchOne(contentId: string, user?: string, populate = true): Promise<ContentDocument> {
        const query = { _id: contentId, 'audit.isDeleted': false };

        if (user) {
            query['author'] = user;
        }

        if (populate) {
            return this.content.findOne(query).populate('author');
        } else {
            return this.content.findOne(query);
        }
    }

    /**
     * Finds a bunch of content documents belonging to a user, per that user's
     * request.
     *
     * @param userId The user making the request
     */
    async fetchAll(userId: string): Promise<ContentDocument[]> {
        return this.content
            .find({
                author: userId,
                'audit.isDeleted': false,
            })
            .sort({ createdAt: 1 });
    }

    /**
     * Finds a bunch of content documents belonging to a user, per that user's request, filtered by ContentKind.
     *
     * @param userId
     * @param kinds
     */
    async fetchAllByKind(
        userId: string,
        kinds: ContentKind[],
    ): Promise<PaginateResult<ContentDocument>> {
        const query = {
            author: userId,
            kind: { $in: kinds },
            'audit.isDeleted': false,
        };
        const paginateOptions: PaginateOptions = {
            sort: { createdAt: this.NEWEST_FIRST },
            pagination: false,
            populate: 'author',
        };

        return await this.content.paginate(query, paginateOptions);
    }

    /**
     * Fetches all sections of a work, depending on whether or not you want them published.
     *
     * @param contentId
     * @param published
     * @param userId
     */
    async fetchSections(contentId: string, published = false, userId?: string) {
        if (published) {
            const content = await this.content
                .findOne({ _id: contentId, 'audit.isDeleted': false })
                .populate({
                    path: 'sections',
                    match: { 'audit.isDeleted': { $eq: false } },
                    select: '_id title published stats.words audit.publishedOn createdAt',
                });
            const sections = (content as ProseContentDocument).sections as Section[];
            if (sections) {
                return sections.filter((item) => item.published === true);
            } else {
                return [];
            }
        } else {
            const content = await this.content
                .findOne({ _id: contentId, author: userId, 'audit.isDeleted': false })
                .populate({
                    path: 'sections',
                    match: { 'audit.isDeleted': { $eq: false } },
                    select: '_id title published stats.words audit.publishedOn createdAt',
                });
            const sections = (content as ProseContentDocument).sections;
            if (sections) {
                return (content as ProseContentDocument).sections as Section[];
            } else {
                return [];
            }
        }
    }

    /**
     * Fetches a section by ID. Optionally performs an extra check to only fetch a published section.
     *
     * @param sectionId The section ID
     * @param published (optional)
     */
    async fetchSectionById(sectionId: string, published = false): Promise<SectionsDocument> {
        if (published === true) {
            return this.sections.findOne({
                _id: sectionId,
                published: true,
                'audit.isDeleted': false,
            });
        } else {
            return this.sections.findOne({ _id: sectionId, 'audit.isDeleted': false });
        }
    }

    //#endregion

    //#region ---CREATE, EDIT, DELETE---

    /**
     * Routes a request for creating some content to the appropriate API functions, given the specified
     * `ContentKind`.
     *
     * @param userId The author of the content
     * @param kind The content kind
     * @param formInfo The form information
     */
    async createOne(userId: string, kind: ContentKind, formInfo: FormType) {
        switch (kind) {
            case ContentKind.BlogContent:
                return await this.blogContent.createNewBlog(userId, formInfo as BlogForm);
            case ContentKind.PoetryContent:
                return await this.poetryContent.createPoetry(userId, formInfo as CreatePoetry);
            case ContentKind.ProseContent:
                return await this.proseContent.createProse(userId, formInfo as CreateProse);
        }
    }

    /**
     * Checks to see if a piece of content exists with the correct user and content ID. If so, routes
     * the function to dedicated editing functions across the API. If not, throws an `UnauthorizedException`.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param formInfo The form information
     */
    async saveChanges(user: string, contentId: string, formInfo: FormType) {
        const content = await this.content.findOne({
            _id: contentId,
            author: user,
            'audit.isDeleted': false,
        });

        if (content === null || content === undefined) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            switch (content.kind) {
                case ContentKind.BlogContent:
                    return await this.blogContent.editBlog(user, contentId, formInfo as BlogForm);
                case ContentKind.PoetryContent:
                    return await this.poetryContent.editPoetry(
                        user,
                        contentId,
                        formInfo as CreatePoetry,
                    );
                case ContentKind.ProseContent:
                    return await this.proseContent.editProse(
                        user,
                        contentId,
                        formInfo as CreateProse,
                    );
            }
        }
    }

    async updatePublishStatus(
        user: string,
        contentId: string,
        pubStatus: PubStatus,
    ): Promise<ContentDocument> {
        const content = await this.content.findOne({
            _id: contentId,
            author: user,
            'audit.isDeleted': false,
        });

        if (content === null || content === undefined) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            if (
                content.audit.published === PubStatus.Pending &&
                pubStatus === PubStatus.Published
            ) {
                content.audit.publishedOn = new Date();
            }
            content.audit.published = pubStatus;
            return await content.save();
        }
    }

    /**
     * Sets the `isDeleted` flag of a piece of content belonging to the specified user to `true`.
     *
     * @param user The owner of this content
     * @param contentId The content's ID
     */
    async deleteOne(user: string, contentId: string): Promise<void> {
        await this.content.updateOne({ _id: contentId, author: user }, { 'audit.isDeleted': true });
    }

    /**
     * Counts the number of published documents for a specific user ID, filtered by `kinds`.
     *
     * @param user
     * @param kinds
     */
    async countContent(user: string, kinds: ContentKind[]) {
        const query = {
            author: user,
            kind: { $in: kinds },
            'audit.isDeleted': false,
            'audit.published': 'Published',
        };

        return this.content.count(query);
    }

    //#endregion

    //#region ---SECTIONS---

    /**
     * Adds a section to some content. Only applicable to Prose, Poetry, and Scripts.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param sectionInfo The new section's info
     */
    async createSection(
        user: string,
        contentId: string,
        sectionInfo: SectionForm,
    ): Promise<SectionsDocument> {
        const work = await this.content.findOne(
            { _id: contentId, author: user, 'audit.isDeleted': false },
            { autopopulate: false },
        );

        if (work === null || work === undefined) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const sec: SectionsDocument = await this.sectionsStore.createNewSection(
                contentId,
                sectionInfo,
            );
            await this.content.updateOne(
                { _id: contentId, author: user, 'audit.isDeleted': false },
                { $push: { sections: sec._id } },
                { strict: false },
            );
            return sec;
        }
    }

    /**
     * Updates a given section with the new info. If the section is published, subtract the old word count and then add the new word count.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param sectionId The section ID
     * @param sectionInfo The new section info
     */
    async editSection(
        user: string,
        contentId: string,
        sectionId: string,
        sectionInfo: SectionForm,
    ): Promise<SectionsDocument> {
        const work = await this.content.findOne(
            { _id: contentId, author: user, 'audit.isDeleted': false },
            { autopopulate: false },
        );

        if (work === null || work === undefined) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const sec: SectionsDocument = await this.sectionsStore.editSection(
                sectionId,
                sectionInfo,
            );
            if (sec.published === true) {
                await this.content.updateOne(
                    { _id: contentId, author: user, 'audit.isDeleted': false },
                    { $inc: { 'stats.words': -sectionInfo.oldWords } },
                );
                await this.content.updateOne(
                    { _id: contentId, author: user, 'audit.isDeleted': false },
                    { $inc: { 'stats.words': sec.stats.words } },
                );
            }

            return sec;
        }
    }

    /**
     * Publishes a section. If any change occurred in said section's publishing status, then it updates the parent content's wordcount
     * accordingly.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param sectionId The section ID
     * @param pubStatus The publishing status for this section
     */
    async publishSection(
        user: string,
        contentId: string,
        sectionId: string,
        pubStatus: PublishSection,
    ): Promise<SectionsDocument> {
        const work = await this.content.findOne(
            { _id: contentId, author: user, 'audit.isDeleted': false },
            { autopopulate: false },
        );

        if (work === null || work === undefined) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const sec = await this.sectionsStore.publishSection(sectionId, pubStatus);
            if (sec.published === true && pubStatus.oldPub === false) {
                // if newly published
                await this.content.updateOne(
                    { _id: contentId, author: user, 'audit.isDeleted': false },
                    { $inc: { 'stats.words': sec.stats.words } },
                    { strict: false },
                );
            } else if (sec.published === false && pubStatus.oldPub === true) {
                // if unpublished
                await this.content.updateOne(
                    { _id: contentId, author: user, 'audit.isDeleted': false },
                    { $inc: { 'stats.words': -sec.stats.words } },
                    { strict: false },
                );
            }
            return sec;
        }
    }

    /**
     * Deletes a section and updates the parent wordcount accordingly if that section was published.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param sectionId The section ID
     */
    async deleteSection(user: string, contentId: string, sectionId: string): Promise<void> {
        const work = await this.content.findOne(
            { _id: contentId, author: user, 'audit.isDeleted': false },
            { autopopulate: false },
        );

        if (work === null || work === undefined) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const sec = await this.sectionsStore.deleteSection(sectionId);
            if (sec.published === true) {
                await this.content.updateOne(
                    { _id: contentId, author: user, 'audit.isDeleted': false },
                    {
                        $inc: { 'stats.totWords': -sec.stats.words },
                        $pull: { sections: sec._id },
                    },
                    { strict: false },
                );
            }
        }
    }

    //#endregion

    //#region ---COMMENTS---

    /**
     * Adds a comment to some content.
     *
     * @param contentId The content's ID
     */
    async addComment(contentId: string): Promise<void> {
        await this.content.updateOne(
            { _id: contentId },
            {
                $inc: { 'stats.comments': 1 },
            },
        );
    }

    //#endregion

    //#region ---TAGS---

    /**
     * Go through every piece of content, and remove the given `tagId` from
     * its `tags` array.
     * @param tagId The ID of the tag to remove.
     */
    public async removeTagReferences(tagId: string): Promise<void> {
        await this.content.updateMany({}, { $pull: { tags: { _id: tagId } } });
    }

    //#endregion
}
