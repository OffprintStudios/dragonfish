import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { ContentGroupStore, ContentStore, PoetryStore, ProseStore } from '@dragonfish/api/database/content/stores';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import {
    ContentFilter,
    ContentKind,
    ContentModel,
    FormType,
    PubChange,
    PubStatus,
} from '@dragonfish/shared/models/content';
import { RatingsModel } from '@dragonfish/shared/models/ratings';
import { PseudonymsStore } from '@dragonfish/api/database/accounts/stores';

@Injectable()
export class ContentService {
    constructor(
        private readonly content: ContentStore,
        private readonly contentGroup: ContentGroupStore,
        private readonly poetry: PoetryStore,
        private readonly prose: ProseStore,
        private readonly pseudonyms: PseudonymsStore,
    ) {}

    public async fetchOne(contentId: string, pseudId?: string): Promise<ContentModel> {
        const content = await this.content.fetchOne(contentId, pseudId);
        if (content.audit.published === 'Published') {
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
        const savedContent = await this.content.saveChanges(user, contentId, formInfo);

        await this.updateCounts(user);

        return savedContent;
    }

    public async deleteOne(user: string, contentId: string): Promise<void> {
        const deletedContent = await this.content.deleteOne(user, contentId);

        await this.updateCounts(user);

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
    private async updateCounts(user: string) {
        await this.pseudonyms.updateBlogCount(user, await this.content.countContent(user, [ContentKind.BlogContent]));
        await this.pseudonyms.updateWorkCount(
            user,
            await this.content.countContent(user, [ContentKind.ProseContent, ContentKind.PoetryContent]),
        );
    }
}
