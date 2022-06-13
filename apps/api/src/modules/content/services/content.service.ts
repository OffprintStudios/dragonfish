import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import {
    BlogsStore,
    ContentGroupStore,
    ContentStore,
    PoetryStore,
    ProseStore,
    TagsStore,
} from '../db/stores';
import { JwtPayload } from '$shared/auth';
import {
    ContentFilter,
    ContentKind,
    ContentModel,
    ContentSorting,
    CreateProse,
    FormType,
    NewsChange,
    PubChange,
    PubStatus,
    TagsModel,
} from '$shared/models/content';
import { RatingsModel } from '$shared/models/ratings';
import { UserService } from '$modules/accounts';
import { xor } from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApprovalQueueEventsKind, SubmitToQueuePayload } from '$shared/models/admin/approval-queue';

@Injectable()
export class ContentService {
    constructor(
        private readonly content: ContentStore,
        private readonly contentGroup: ContentGroupStore,
        private readonly poetry: PoetryStore,
        private readonly prose: ProseStore,
        private readonly blogs: BlogsStore,
        private readonly users: UserService,
        private readonly tagsStore: TagsStore,
        private readonly events: EventEmitter2,
    ) {}

    public async fetchOne(contentId: string, pseudId?: string): Promise<ContentModel> {
        const content = await this.content.fetchOne(contentId, pseudId);
        if (content.audit.published === PubStatus.Published) {
            await this.contentGroup.incrementViewCount(content._id);
        }
        return content;
    }

    public async fetchOnePublished(
        contentId: string,
        kind: ContentKind,
        user?: JwtPayload,
    ): Promise<[ContentModel, RatingsModel]> {
        return await this.contentGroup.fetchOnePublished(contentId, kind, user);
    }

    public async fetchAll(userId: string): Promise<ContentModel[]> {
        return await this.content.fetchAll(userId);
    }

    public async fetchAllByKind(
        userId: string,
        kinds: ContentKind[],
    ): Promise<PaginateResult<ContentModel>> {
        return await this.content.fetchAllByKind(userId, kinds);
    }

    public async fetchAllPublished(
        pageNum: number,
        kinds: ContentKind[],
        filter: ContentFilter,
        sorting: ContentSorting,
        userId?: string,
    ): Promise<PaginateResult<ContentModel>> {
        return await this.contentGroup.fetchAllPublished(pageNum, kinds, filter, sorting, userId);
    }

    async getUserProfile(
        userId: string,
        filter: ContentFilter,
    ): Promise<{ works: ContentModel[]; blogs: ContentModel[] }> {
        return await this.contentGroup.fetchFirstThreePublished(filter, userId);
    }

    public async createOne(
        user: string,
        kind: ContentKind,
        formInfo: FormType,
    ): Promise<ContentModel> {
        const createdContent = await this.content.createOne(user, kind, formInfo);

        await this.updateCounts(user);

        return createdContent;
    }

    public async saveOne(
        user: string,
        contentId: string,
        formInfo: FormType,
    ): Promise<ContentModel> {
        // Gets the old works tags
        const work = await this.content.fetchOne(contentId);
        const oldTags = work.tags;
        let oldTagIds: string[] = [];
        if (work.audit.published === PubStatus.Published && oldTags && oldTags.length > 0) {
            if (typeof oldTags[0] === 'object') {
                oldTagIds = oldTags.map((tag) => (tag as TagsModel)._id);
            } else {
                oldTagIds = oldTags as string[];
            }
        }

        const savedContent = await this.content.saveChanges(user, contentId, formInfo);

        await this.updateCounts(user);

        // If this work is published, updates number of published works tagged with each tag
        if (work.audit.published === PubStatus.Published) {
            // Gets all tags that aren't shared between the old tag list and the new one
            // Which is to say, the ones removed and the ones added, but not the ones kept the same
            const changedTags = xor(oldTagIds, (formInfo as CreateProse)?.tags);

            // Updates number of published works tagged with each tag
            await this.updateTagCounts(changedTags);
        }

        return savedContent;
    }

    public async deleteOne(user: string, contentId: string): Promise<void> {
        // Gets the works tags to update the counts for each after deletion
        const work = await this.content.fetchOne(contentId);
        const tags = work.tags;

        const deletedContent = await this.content.deleteOne(user, contentId);

        await this.updateCounts(user);
        await this.updateTagCounts(tags);

        return deletedContent;
    }

    public async publishOne(
        user: string,
        contentId: string,
        pubChange?: PubChange,
    ): Promise<ContentModel> {
        const content = await this.content.fetchOne(contentId, user);
        switch (content.kind) {
            case ContentKind.ProseContent:
            case ContentKind.PoetryContent:
                const payload: SubmitToQueuePayload = {
                    content,
                };
                this.events.emit(ApprovalQueueEventsKind.SubmitToQueue, payload);
                return content;
            case ContentKind.BlogContent:
                const blog = await this.blogs.changePublishStatus(user, contentId, pubChange);
                await this.updateCounts(user);
                return blog;
        }
    }

    public async updatePublishStatus(
        user: string,
        contentId: string,
        pubStatus: PubStatus,
    ): Promise<ContentModel> {
        // Gets the works tags to update the counts for each
        const work = await this.content.fetchOne(contentId);
        const tags = work.tags;

        const updatedContent = await this.content.updatePublishStatus(user, contentId, pubStatus);

        await this.updateCounts(user);
        await this.updateTagCounts(tags);

        return updatedContent;
    }

    public async updateCoverArt(
        user: string,
        contentId: string,
        kind: ContentKind,
        coverArt: string,
    ): Promise<ContentModel> {
        // Gets the works tags to update the counts for each
        const work = await this.content.fetchOne(contentId);
        const tags = work.tags;

        await this.updateCounts(user);
        await this.updateTagCounts(tags);

        if (kind === ContentKind.PoetryContent) {
            return await this.poetry.updateCoverArt(user, contentId, coverArt);
        } else if (kind === ContentKind.ProseContent) {
            return await this.prose.updateCoverArt(user, contentId, coverArt);
        } else {
            throw new BadRequestException(`Invalid content kind.`);
        }
    }

    public async removeTagReferences(tagId: string): Promise<void> {
        await this.content.removeTagReferences(tagId);
    }

    public async toggleNewsPost(pseudId: string, newsChange: NewsChange) {
        return await this.blogs.toggleNewsPost(pseudId, newsChange);
    }

    public async changeBanner(pseudId: string, blogId: string, bannerUrl: string) {
        return await this.blogs.changeBanner(blogId, pseudId, bannerUrl);
    }

    public async toggleFeatured(pseudId: string, featuredChange: NewsChange) {
        return await this.blogs.toggleFeatured(pseudId, featuredChange);
    }

    public async fetchFirstNewsPosts() {
        return await this.contentGroup.fetchForHome();
    }

    public async fetchFeaturedPosts() {
        return await this.contentGroup.fetchFeaturedPosts();
    }

    public async updateCommentCount(contentId: string, totalComments: number): Promise<void> {
        return await this.content.updateCommentCount(contentId, totalComments);
    }

    /**
     * Updates user's counts of both blogs and works
     * @param user
     */
    private async updateCounts(user: string): Promise<void> {
        await this.users.updateCounts(
            user,
            await this.content.countContent(user, [ContentKind.BlogContent]),
            await this.content.countContent(user, [
                ContentKind.ProseContent,
                ContentKind.PoetryContent,
            ]),
        );
    }

    private async updateTagCounts(tags: string[] | TagsModel[]): Promise<void> {
        if (tags) {
            for (const tag of tags) {
                if (typeof tag === 'object') {
                    await this.tagsStore.updateTaggedWorks(tag._id);
                } else {
                    await this.tagsStore.updateTaggedWorks(tag);
                }
            }
        }
    }
}
