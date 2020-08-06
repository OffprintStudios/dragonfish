import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutpopulate from 'mongoose-autopopulate';

export const ApprovalQueueSchema = new Schema({
    workToApprove: {type: String, ref: 'Work', required: true, autopopulate: true},
    claimedBy: {type: String, ref: 'User', default: null, autopopulate: {
        select: '_id username avatar'
    }},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
}, {timestamps: true, autoIndex: true, collection: 'approval_queue'});

ApprovalQueueSchema.plugin(MongooseAutpopulate);

