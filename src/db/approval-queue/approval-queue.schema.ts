import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutpopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { generate } from 'shortid';
import { ApprovalQueueDocument } from './models';

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
ApprovalQueueSchema.plugin(MongoosePaginate);

ApprovalQueueSchema.pre<ApprovalQueueDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());

    return next();
});