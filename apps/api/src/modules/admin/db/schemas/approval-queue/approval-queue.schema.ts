import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

import type { ApprovalQueue } from '$shared/models/admin/approval-queue';
import type { ContentModel } from '$shared/models/content';
import type { Pseudonym } from '$shared/models/accounts';

@Schema({ timestamps: true, autoIndex: true, collection: 'approval_queue' })
export class ApprovalQueueDocument extends Document implements ApprovalQueue {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Content', required: true })
    readonly workToApprove: string | ContentModel;

    @Prop({
        type: String,
        ref: 'Pseudonym',
        default: null,
        autopopulate: true,
    })
    claimedBy: string | Pseudonym;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const ApprovalQueueSchema = SchemaFactory.createForClass(ApprovalQueueDocument);
