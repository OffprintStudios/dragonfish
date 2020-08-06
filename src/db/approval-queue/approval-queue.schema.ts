import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutpopulate from 'mongoose-autopopulate';
import { generate } from 'shortid';
import { ApprovalQueue } from './models';

export const ApprovalQueueSchema = new Schema({
    _id: {type: String, default: generate()},
    workToApprove: {type: String, ref: 'Work', required: true, autopopulate: true},
    claimedBy: {type: String, ref: 'User', default: null, autopopulate: {
        select: '_id username profile.avatar'
    }},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
}, {timestamps: true, autoIndex: true, collection: 'approval_queue'});

ApprovalQueueSchema.plugin(MongooseAutpopulate);

ApprovalQueueSchema.pre<ApprovalQueue>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
});