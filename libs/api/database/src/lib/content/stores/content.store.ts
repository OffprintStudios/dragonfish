import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { ContentDocument, SectionsDocument } from '../schemas';
import {
    BlogForm,
    ContentKind,
    CreatePoetry,
    CreateProse,
    FormType,
    NewsForm,
    PubChange,
    PubStatus,
} from '@dragonfish/shared/models/content';
import { BlogsContentDocument, NewsContentDocument } from '../schemas';
import { NotificationKind } from '@dragonfish/shared/models/notifications';
import { BlogsStore } from './blogs.store';
import { NewsStore } from './news.store';
import { ProseStore } from './prose.store';
import { PoetryStore } from './poetry.store';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { UsersStore } from '../../users';
import { NotificationsService, UnsubscribeResult } from '../../notifications';
import { ApprovalQueueStore } from '../../approval-queue';
import { PublishSection, SectionForm } from '@dragonfish/shared/models/sections';
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
        private readonly users: UsersStore,
        private readonly blogContent: BlogsStore,
        private readonly newsContent: NewsStore,
        private readonly proseContent: ProseStore,
        private readonly poetryContent: PoetryStore,
        private readonly sectionsStore: SectionsStore,
        private readonly notifications: NotificationsService,
        private readonly queue: ApprovalQueueStore,
    ) {}

    //#region ---FETCHING---

    /**
     * Fetches one item from the content collection via ID.
     * @param contentId A content's ID
     * @param user The user making this request
     */
    async fetchOne(contentId: string, user?: string): Promise<ContentDocument> {
        const query = { _id: contentId, 'audit.isDeleted': false };

        if (user) {
            query['author'] = user;
        }

        return this.content.findOne(query);
    }

    /**
     * Fetches a pending work from the database. For use by admins/moderators/work approvers via the dashboard.
     *
     * @param contentId The content ID
     * @param kind The content kind
     * @param userId The owner of the content
     */
    async fetchOnePending(contentId: string, kind: ContentKind, userId: string): Promise<ContentDocument> {
        return this.content.findOne({
            _id: contentId,
            author: userId,
            kind: kind,
            'audit.isDeleted': false,
            'audit.published': PubStatus.Pending,
        });
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
    async fetchAllByKind(userId: string, kinds: ContentKind[]): Promise<PaginateResult<ContentDocument>> {
        const query = {
            author: userId,
            kind: { $in: kinds },
            'audit.isDeleted': false,
        };
        const paginateOptions: PaginateOptions = { sort: { createdAt: this.NEWEST_FIRST }, pagination: false };

        return await this.content.paginate(query, paginateOptions);
    }

    /**
     * Fetches a section by ID. Optionally performs an extra check to only fetch a published section.
     *
     * @param sectionId The section ID
     * @param published (optional)
     */
    async fetchSectionById(sectionId: string, published?: boolean): Promise<SectionsDocument> {
        if (published) {
            return this.sections.findOne({ _id: sectionId, published: true });
        } else {
            return this.sections.findOne({ _id: sectionId });
        }
    }

    /**
     * Fetches all sections, published and unpublished, associated with the provided content belonging to the specified user.
     *
     * @param user The author of the content
     * @param contentId The content ID
     */
    async fetchUserContentSections(user: string, contentId: string): Promise<SectionsDocument[]> {
        const work = await this.content.findOne(
            { _id: contentId, author: user, 'audit.isDeleted': false },
            { autopopulate: false },
        );

        if (isNullOrUndefined(work)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const workContent = work as any;

            return await this.sectionsStore.fetchSectionsList(workContent.sections);
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
            case ContentKind.NewsContent:
                return await this.newsContent.createNewPost(userId, formInfo as NewsForm);
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
        const content = await this.content.findOne({ _id: contentId, author: user, 'audit.isDeleted': false });

        if (isNullOrUndefined(content)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            switch (content.kind) {
                case ContentKind.BlogContent:
                    return await this.blogContent.editBlog(user, contentId, formInfo as BlogForm);
                case ContentKind.NewsContent:
                    return await this.newsContent.editPost(user, contentId, formInfo as NewsForm);
                case ContentKind.PoetryContent:
                    return await this.poetryContent.editPoetry(user, contentId, formInfo as CreatePoetry);
                case ContentKind.ProseContent:
                    return await this.proseContent.editProse(user, contentId, formInfo as CreateProse);
            }
        }
    }

    /**
     * Checks to see if a piece of content exists with the correct user and content ID. If so, routes
     * the function to dedicated publishing functions across the API. If not, throw an `UnauthorizedException`.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param pubChange (Optional) Publishing status updates for Blogs and News
     */
    async publishOne(
        user: string,
        contentId: string,
        pubChange?: PubChange,
    ): Promise<ContentDocument | BlogsContentDocument | NewsContentDocument> {
        const content = await this.content.findOne({ _id: contentId, author: user, 'audit.isDeleted': false });

        if (isNullOrUndefined(content)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            switch (content.kind) {
                case ContentKind.BlogContent:
                    return await this.blogContent.changePublishStatus(user, contentId, pubChange);
                case ContentKind.NewsContent:
                    return await this.newsContent.setPublishStatus(user, contentId, pubChange);
                case ContentKind.PoetryContent:
                    return await this.submitForApproval(user, contentId);
                case ContentKind.ProseContent:
                    return await this.submitForApproval(user, contentId);
                default:
                    throw new BadRequestException(`Invalid content kind.`);
            }
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

        // Unsubscribe the user from comments on the now-deleted work
        const unsubResult: UnsubscribeResult = await this.notifications.unsubscribe(
            user,
            contentId,
            NotificationKind.CommentNotification,
        );
        if (unsubResult !== UnsubscribeResult.Success) {
            console.error(
                `Failed to unsubscribe user '${user}' from notifications on content with ID: '${contentId}'. Reason: ${unsubResult}`,
            );
        }

        // TODO: Once users have the ability to subscribe to things, we need to unsubscribe _all_ subscribers to this piece of content.
        // ...maybe work for another background queue processor
    }

    //#endregion

    //#region ---WORKS PUBLISHING---

    /**
     * Submits a piece of content to the approval queue.
     *
     * @param user The author of the content
     * @param contentId The content to submit
     */
    async submitForApproval(user: string, contentId: string): Promise<ContentDocument> {
        const thisContent = await this.content.findOne({
            _id: contentId,
            author: user,
            'audit.isDeleted': false,
        });

        if (thisContent.kind !== ContentKind.PoetryContent && thisContent.stats.words < 750) {
            throw new BadRequestException(`Content that isn't poetry needs to have a minimum word-count of 750. `);
        }

        await this.queue.addOneWork(contentId);
        return await this.pendingWork(contentId, user);
    }

    /**
     * Sets the approval status of a work to Approved.
     *
     * @param docId
     * @param modId
     * @param contentId The work to approve
     * @param authorId The author of the work
     */
    async approveWork(docId: string, modId: string, contentId: string, authorId: string): Promise<void> {
        await this.content.updateOne(
            { _id: contentId, author: authorId, 'audit.isDeleted': false },
            {
                'audit.published': PubStatus.Published,
                'audit.publishedOn': new Date(),
            },
        );
        await this.queue.removeFromQueue(docId, modId);
        await this.users.changeWorkCount(authorId, true);
    }

    /**
     * Sets the approval status of a work to Rejected.
     *
     * @param docId
     * @param modId
     * @param contentId The work to reject
     * @param authorId The author of the work
     */
    async rejectWork(docId: string, modId: string, contentId: string, authorId: string): Promise<void> {
        await this.content.updateOne(
            { _id: contentId, author: authorId, 'audit.isDeleted': false },
            { 'audit.published': PubStatus.Rejected },
        );
        await this.queue.removeFromQueue(docId, modId);
    }

    /**
     * Sets the approval status of a work to Pending.
     *
     * @param contentId The work to set to pending
     * @param authorId The author of the work
     */
    async pendingWork(contentId: string, authorId: string): Promise<ContentDocument> {
        return this.content.findOneAndUpdate(
            { _id: contentId, author: authorId, 'audit.isDeleted': false },
            { 'audit.published': PubStatus.Pending },
            { new: true },
        );
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
    async createSection(user: string, contentId: string, sectionInfo: SectionForm): Promise<SectionsDocument> {
        const work = await this.content.findOne(
            { _id: contentId, author: user, 'audit.isDeleted': false },
            { autopopulate: false },
        );

        if (isNullOrUndefined(work)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const sec: SectionsDocument = await this.sectionsStore.createNewSection(contentId, sectionInfo);
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

        if (isNullOrUndefined(work)) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        } else {
            const sec: SectionsDocument = await this.sectionsStore.editSection(sectionId, sectionInfo);
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

        if (isNullOrUndefined(work)) {
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

        if (isNullOrUndefined(work)) {
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
