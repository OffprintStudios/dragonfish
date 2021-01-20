import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';

export interface ApprovalQueueStateModel {
    claimedDocs: ApprovalQueue[];
    selectedDoc: ApprovalQueue | null;
}