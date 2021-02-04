import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

import { ApprovalQueue } from '@dragonfish/models/approval-queue';
import { ContentModel } from '@dragonfish/models/content';
import { UserInfo } from '@dragonfish/models/users';

@Schema({ timestamps: true, autoIndex: true, collection: 'approval_queue' })
export class ApprovalQueueDocument extends Document implements ApprovalQueue {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Content', required: true, autopopulate: true })
    readonly workToApprove: string | ContentModel;

    @Prop({
        type: String,
        ref: 'User',
        default: null,
        autopopulate: {
            select: '_id username profile.avatar audit.roles',
        },
    })
    claimedBy: string | UserInfo;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ApprovalQueueSchema = SchemaFactory.createForClass(ApprovalQueueDocument);
