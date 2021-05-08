import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { ContentStore, PoetryStore, ProseStore } from '../../db/content';
import { IContent } from '../../shared/content/content.interface';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import {
    ContentModel,
    ContentKind,
    FormType,
    SetRating,
    ContentFilter,
    PubChange,
    PubStatus,
} from '@dragonfish/shared/models/content';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { NotificationsService } from '../../db/notifications/notifications.service';
import { NotificationKind } from '@dragonfish/shared/models/notifications';
import { NotificationEnumConverters } from '../../db/notifications/notification-enum-converters';

@Injectable()
export class ContentService implements IContent {
    private readonly logger: Logger = new Logger(ContentService.name);

    constructor(
        private readonly content: ContentStore,
        private readonly poetry: PoetryStore,
        private readonly prose: ProseStore,
        private readonly notifications: NotificationsService,
    ) { }

    async fetchOne(contentId: string, kind: ContentKind, user: JwtPayload): Promise<ContentModel> {
        return await this.content.fetchOne(contentId, kind, user);
    }

    async fetchOnePublished(contentId: string, kind: ContentKind, user?: JwtPayload): Promise<ContentModel> {
        return await this.content.fetchOnePublished(contentId, kind, user);
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
        return await this.content.fetchAllPublished(pageNum, kinds, filter, userId);
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

    async setLike(user: JwtPayload, setRating: SetRating): Promise<ReadingHistory> {
        return await this.content.setLike(user, setRating.workId, setRating.oldApprovalRating);
    }

    async setDislike(user: JwtPayload, setRating: SetRating): Promise<ReadingHistory> {
        return await this.content.setDislike(user, setRating.workId, setRating.oldApprovalRating);
    }

    async setNoVote(user: JwtPayload, setRating: SetRating): Promise<ReadingHistory> {
        return await this.content.setNoVote(user, setRating.workId, setRating.oldApprovalRating);
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
