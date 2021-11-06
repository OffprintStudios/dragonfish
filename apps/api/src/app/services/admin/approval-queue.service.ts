import { Injectable, Logger } from '@nestjs/common';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { PaginateResult } from 'mongoose';

import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';
import { ApprovalQueueStore } from '@dragonfish/api/database/approval-queue';
import { ContentStore, TagsStore } from '@dragonfish/api/database/content/stores';
import { IApprovalQueue } from '../../shared/admin';
import { PseudonymsStore } from '@dragonfish/api/database/accounts/stores';

@Injectable()
export class ApprovalQueueService implements IApprovalQueue {
    private readonly logger: Logger = new Logger(ApprovalQueueService.name);

    constructor(
        private approvalQueueStore: ApprovalQueueStore,
        private content: ContentStore,
        private pseudonyms: PseudonymsStore,
        private readonly tagsStore: TagsStore,
    ) {}

    async getQueue(pageNum: number): Promise<PaginateResult<ApprovalQueue>> {
        return await this.approvalQueueStore.fetchAll(pageNum);
    }

    async viewContent(contentId: string, kind: ContentKind, userId: string): Promise<ContentModel> {
        return await this.content.fetchOnePending(contentId, kind, userId);
    }

    async claimContent(user: any, docId: string): Promise<ApprovalQueue> {
        return await this.approvalQueueStore.claimWork(user, docId);
    }

    async approveContent(user: any, docId: string, workId: string, authorId: string): Promise<void> {
        await this.content.approveWork(docId, user, workId, authorId);
        await this.pseudonyms.updateWorkCount(
            user,
            await this.content.countContent(user, [ContentKind.ProseContent, ContentKind.PoetryContent]),
        );

        // Get the works tags and update the counts for each
        const work = await this.content.fetchOne(workId);
        for (const tag of work.tags) {
            if (typeof tag === 'object') {
                await this.tagsStore.updateTaggedWorks(tag._id);
            } else {
                await this.tagsStore.updateTaggedWorks(tag);
            }
        }
    }

    async rejectContent(user: any, docId: string, workId: string, authorId: string): Promise<void> {
        return await this.content.rejectWork(docId, user, workId, authorId);
    }
}
