import { Injectable, Logger } from '@nestjs/common';
import { ApprovalQueue } from '@dragonfish/models/approval-queue';
import { PaginateResult } from 'mongoose';

import { ContentKind, ContentModel } from '@dragonfish/models/content';
import { ApprovalQueueStore } from '../../db/approval-queue/approval-queue.store';
import { ContentStore } from '../../db/content';
import { IApprovalQueue } from '../../shared/admin/approval-queue.interface';

@Injectable()
export class ApprovalQueueService implements IApprovalQueue {
    private readonly logger: Logger = new Logger(ApprovalQueueService.name);

    constructor(private approvalQueueService: ApprovalQueueStore, private contentService: ContentStore) {}

    async getQueue(pageNum: number): Promise<PaginateResult<ApprovalQueue>> {
        return await this.approvalQueueService.fetchAll(pageNum);
    }

    async viewContent(contentId: string, kind: ContentKind, userId: string): Promise<ContentModel> {
        return await this.contentService.fetchOnePending(contentId, kind, userId);
    }

    async claimContent(user: any, docId: string): Promise<ApprovalQueue> {
        return await this.approvalQueueService.claimWork(user, docId);
    }

    async approveContent(user: any, docId: string, workId: string, authorId: string): Promise<void> {
        return await this.contentService.approveWork(docId, user.sub, workId, authorId);
    }

    async rejectContent(user: any, docId: string, workId: string, authorId: string): Promise<void> {
        return await this.contentService.rejectWork(docId, user.sub, workId, authorId);
    }
}
