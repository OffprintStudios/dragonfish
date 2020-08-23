import { Document } from 'mongoose';

import { ApprovalQueue } from '@pulp-fiction/models/approval-queue'

export interface ApprovalQueueDocument extends ApprovalQueue, Document {
    readonly _id: string;
}