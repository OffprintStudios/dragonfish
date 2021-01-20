import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { PaginateResult } from '@pulp-fiction/models/util';

export interface ApprovalQueueStateModel {
    currPageDocs: PaginateResult<ApprovalQueue> | null;
    claimedDocs: ApprovalQueue[];
    selectedDoc: ApprovalQueue | null;
}