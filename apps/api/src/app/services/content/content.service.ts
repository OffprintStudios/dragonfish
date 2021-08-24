import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { BrowseStore, ContentStore, PoetryStore, ProseStore } from '@dragonfish/api/database/content/stores';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import {
    ContentModel,
    ContentKind,
    FormType,
    ContentFilter,
    PubChange,
    PubStatus,
} from '@dragonfish/shared/models/content';
import { NotificationsService } from '@dragonfish/api/database/notifications';
import { NotificationKind } from '@dragonfish/shared/models/notifications';
import { RatingsModel } from '@dragonfish/shared/models/ratings';

@Injectable()
export class ContentService {
    constructor(
        private readonly content: ContentStore,
        private readonly browse: BrowseStore,
        private readonly poetry: PoetryStore,
        private readonly prose: ProseStore,
        private readonly notifications: NotificationsService,
    ) {}

    public async fetchOne(contentId: string, kind: ContentKind, user?: JwtPayload): Promise<ContentModel> {
        return await this.content.fetchOne(contentId, kind, user);
    }

    public async fetchOnePublished(
        contentId: string,
        kind: ContentKind,
        user?: JwtPayload,
    ): Promise<[ContentModel, RatingsModel]> {
        return await this.browse.fetchOnePublished(contentId, kind, user);
    }

    public async fetchAll(userId: string): Promise<ContentModel[]> {
        return await this.content.fetchAll(userId);
    }

    public async fetchAllPublished(
        pageNum: number,
        kinds: ContentKind[],
        filter: ContentFilter,
        userId?: string,
    ): Promise<PaginateResult<ContentModel>> {
        return await this.browse.fetchAllPublished(pageNum, kinds, filter, userId);
    }

    public async createOne(user: string, kind: ContentKind, formInfo: FormType): Promise<ContentModel> {
        return await this.content.createOne(user, kind, formInfo);
    }

    public async saveOne(user: string, contentId: string, formInfo: FormType): Promise<ContentModel> {
        return await this.content.saveChanges(user, contentId, formInfo);
    }

    public async deleteOne(user: string, contentId: string): Promise<void> {
        return await this.content.deleteOne(user, contentId);
    }

    public async publishOne(user: string, contentId: string, pubChange?: PubChange): Promise<ContentModel> {
        const publishedContent = await this.content.publishOne(user, contentId, pubChange);

        // If this content is being published, subscribe the author to comments on it.
        if (pubChange.newStatus === PubStatus.Published) {
            await this.notifications.subscribe(user, contentId, NotificationKind.CommentNotification);
        }

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
}
