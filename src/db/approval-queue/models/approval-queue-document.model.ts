import { Document } from 'mongoose';

import { ApprovalQueue } from 'shared/models/approval-queue'

export interface ApprovalQueueDocument extends ApprovalQueue, Document {
    readonly _id: string;
}