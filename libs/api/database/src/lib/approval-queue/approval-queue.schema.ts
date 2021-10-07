import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { ContentModel } from '@dragonfish/shared/models/content';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Schema({ timestamps: true, autoIndex: true, collection: 'approval_queue' })
export class ApprovalQueueDocument extends Document implements ApprovalQueue {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Content', required: true, autopopulate: true })
    readonly workToApprove: string | ContentModel;

    @Prop({
        type: String,
        ref: 'Pseudonym',
        default: null,
        autopopulate: true,
    })
    claimedBy: string | Pseudonym;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ApprovalQueueSchema = SchemaFactory.createForClass(ApprovalQueueDocument);
