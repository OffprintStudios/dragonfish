import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generate } from 'shortid';

import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { ContentModel } from '@pulp-fiction/models/content';
import { UserInfo } from '@pulp-fiction/models/users';

@Schema({timestamps: true, autoIndex: true, collection: 'approval_queue'})
export class ApprovalQueueDocument extends Document implements ApprovalQueue {
    @Prop({default: generate()})
    readonly _id: string;

    @Prop({type: String, ref: 'Content', required: true, autopopulate: true})
    readonly workToApprove: string | ContentModel;

    @Prop({type: String, ref: 'User', default: null, autopopulate: {
        select: '_id username profile.avatar audit.roles'
    }})
    claimedBy: string | UserInfo;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ApprovalQueueSchema = SchemaFactory.createForClass(ApprovalQueueDocument);