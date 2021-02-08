import { Injectable, Logger } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { ContentStore } from '../../db/content';
import { IContent } from '../../shared/content/content.interface';
import { JwtPayload } from '@dragonfish/models/auth';
import { ContentModel, ContentKind, FormType, SetRating, ContentFilter, PubChange } from '@dragonfish/models/content';
import { ReadingHistory } from '@dragonfish/models/reading-history';

@Injectable()
export class ContentService implements IContent {
    private readonly logger: Logger = new Logger(ContentService.name);

    constructor(private readonly content: ContentStore) {}

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
        userId?: string,
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
        return await this.content.publishOne(user, contentId, pubChange);
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
}
