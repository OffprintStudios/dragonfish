import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { BrowseStore, ContentStore, PoetryStore, ProseStore } from '@dragonfish/api/database/content/stores';
import { IContent } from '../../shared/content';
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
export class ContentService implements IContent {
    constructor(
        private readonly content: ContentStore,
        private readonly browse: BrowseStore,
        private readonly poetry: PoetryStore,
        private readonly prose: ProseStore,
        private readonly notifications: NotificationsService,
    ) { }
    async fetchOne(contentId: string, kind: ContentKind, user?: JwtPayload): Promise<ContentModel> {
        return await this.content.fetchOne(contentId, kind, user);
    }

    async fetchOnePublished(contentId: string, kind: ContentKind, user?: JwtPayload): Promise<[ContentModel, RatingsModel]> {
        return await this.browse.fetchOnePublished(contentId, kind, user);
    }

    async fetchAll(user: JwtPayload): Promise<ContentModel[]> {
        return await this.content.fetchAll(user);
    }

    async fetchAllPublished(
        pageNum: number,
        kinds: ContentKind[],
        filter: ContentFilter,
        userId?: string
    ): Promise<PaginateResult<ContentModel>> {
        return await this.browse.fetchAllPublished(pageNum, kinds, filter, userId);
    }

    async createOne(user: JwtPayload, kind: ContentKind, formInfo: FormType): Promise<ContentModel> {
        return await this.content.createOne(user, kind, formInfo);
    }

    async saveOne(user: JwtPayload, contentId: string, formInfo: FormType): Promise<ContentModel> {
        return await this.content.saveChanges(user, contentId, formInfo);
    }

    async deleteOne(user: JwtPayload, contentId: string): Promise<void> {
        return await this.content.deleteOne(user, contentId);
    }

    async publishOne(user: JwtPayload, contentId: string, pubChange?: PubChange): Promise<ContentModel> {
        const publishedContent = await this.content.publishOne(user, contentId, pubChange);

        // If this content is being published, subscribe the author to comments on it.
        if (pubChange.newStatus === PubStatus.Published) {
            await this.notifications.subscribe(user.sub, contentId, NotificationKind.CommentNotification);
        }

        return publishedContent;
    }

    async updateCoverArt(
        user: JwtPayload,
        contentId: string,
        kind: ContentKind,
        coverArt: string
    ): Promise<ContentModel> {
        if (kind === ContentKind.PoetryContent) {
            return await this.poetry.updateCoverArt(user, contentId, coverArt);
        } else if (kind === ContentKind.ProseContent) {
            return await this.prose.updateCoverArt(user, contentId, coverArt);
        } else {
            throw new BadRequestException(`Invalid content kind.`);
        }
    }

}
