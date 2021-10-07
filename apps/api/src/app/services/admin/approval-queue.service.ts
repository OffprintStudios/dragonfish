import { Injectable, Logger } from '@nestjs/common';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { PaginateResult } from 'mongoose';

import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';
import { ApprovalQueueStore } from '@dragonfish/api/database/approval-queue';
import { ContentStore } from '@dragonfish/api/database/content/stores';
import { IApprovalQueue } from '../../shared/admin';

@Injectable()
export class ApprovalQueueService implements IApprovalQueue {
    private readonly logger: Logger = new Logger(ApprovalQueueService.name);

    constructor(private approvalQueueStore: ApprovalQueueStore, private contentService: ContentStore) {}

    async getQueue(pageNum: number): Promise<PaginateResult<ApprovalQueue>> {
        return await this.approvalQueueStore.fetchAll(pageNum);
    }

    async viewContent(contentId: string, kind: ContentKind, userId: string): Promise<ContentModel> {
        return await this.contentService.fetchOnePending(contentId, kind, userId);
    }

    async claimContent(user: any, docId: string): Promise<ApprovalQueue> {
        return await this.approvalQueueStore.claimWork(user, docId);
    }

    async approveContent(user: any, docId: string, workId: string, authorId: string): Promise<void> {
        return await this.contentService.approveWork(docId, user, workId, authorId);
    }

    async rejectContent(user: any, docId: string, workId: string, authorId: string): Promise<void> {
        return await this.contentService.rejectWork(docId, user, workId, authorId);
    }
}
