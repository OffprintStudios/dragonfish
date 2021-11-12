import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import {
    ContentGroupStore,
    ContentStore,
    PoetryStore,
    ProseStore,
    TagsStore,
} from '@dragonfish/api/database/content/stores';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import {
    ContentFilter,
    ContentKind,
    ContentModel,
    CreateProse,
    FormType,
    PubChange,
    PubStatus,
    TagsModel,
} from '@dragonfish/shared/models/content';
import { RatingsModel } from '@dragonfish/shared/models/ratings';
import { PseudonymsStore } from '@dragonfish/api/database/accounts/stores';
import * as lodash from 'lodash';

@Injectable()
export class ContentService {
    constructor(
        private readonly content: ContentStore,
        private readonly contentGroup: ContentGroupStore,
        private readonly poetry: PoetryStore,
        private readonly prose: ProseStore,
        private readonly pseudonyms: PseudonymsStore,
        private readonly tagsStore: TagsStore,
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

    public async fetchAllByKind(userId: string, kinds: ContentKind[]): Promise<PaginateResult<ContentModel>> {
        return await this.content.fetchAllByKind(userId, kinds);
    }

    public async fetchAllPublished(
        pageNum: number,
        kinds: ContentKind[],
        filter: ContentFilter,
        userId?: string,
    ): Promise<PaginateResult<ContentModel>> {
        return await this.contentGroup.fetchAllPublished(pageNum, kinds, filter, userId);
    }

    public async createOne(user: string, kind: ContentKind, formInfo: FormType): Promise<ContentModel> {
        const createdContent = await this.content.createOne(user, kind, formInfo);

        await this.updateCounts(user);

        return createdContent;
    }

    public async saveOne(user: string, contentId: string, formInfo: FormType): Promise<ContentModel> {
        // Gets the old works tags
        const work = await this.content.fetchOne(contentId);
        const oldTags = work.tags;
        let oldTagIds: string[] = [];
        if (work.audit.published === PubStatus.Published && oldTags.length > 0) {
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
            const changedTags = lodash.xor(oldTagIds, (formInfo as CreateProse)?.tags);

            // Updates number of published works tagged with each tag
            for (const tag of changedTags) {
                await this.tagsStore.updateTaggedWorks(tag);
            }
        }

        return savedContent;
    }

    public async deleteOne(user: string, contentId: string): Promise<void> {
        // Gets the works tags to update the counts for each after deletion
        const work = await this.content.fetchOne(contentId);
        const tags = work.tags;

        const deletedContent = await this.content.deleteOne(user, contentId);

        await this.updateCounts(user);

        // Updates number of published works tagged with each tag
        for (const tag of tags) {
            if (typeof tag === 'object') {
                await this.tagsStore.updateTaggedWorks(tag._id);
            } else {
                await this.tagsStore.updateTaggedWorks(tag);
            }
        }

        return deletedContent;
    }

    public async publishOne(user: string, contentId: string, pubChange?: PubChange): Promise<ContentModel> {
        const publishedContent = await this.content.publishOne(user, contentId, pubChange);

        await this.updateCounts(user);

        return publishedContent;
    }

    public async updateCoverArt(
        user: string,
        contentId: string,
        kind: ContentKind,
        coverArt: string,
    ): Promise<ContentModel> {
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

    /**
     * Updates user's counts of both blogs and works
     * @param user
     */
    private async updateCounts(user: string): Promise<void> {
        await this.pseudonyms.updateBlogCount(user, await this.content.countContent(user, [ContentKind.BlogContent]));
        await this.pseudonyms.updateWorkCount(
            user,
            await this.content.countContent(user, [ContentKind.ProseContent, ContentKind.PoetryContent]),
        );
    }
}
