import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { ContentModel } from '@dragonfish/shared/models/content';
import { UserInfo } from '@dragonfish/shared/models/users';
import { Constants } from '@dragonfish/shared/constants';

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
            select: Constants.USER_QUERY,
        },
    })
    claimedBy: string | UserInfo;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ApprovalQueueSchema = SchemaFactory.createForClass(ApprovalQueueDocument);
