import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import * as MongooseAutopopulate from 'mongoose-autopopulate';

import * as documents from './models';
import * as models from 'shared/models/history';

export const HistoryItemSchema = new Schema({
    _id: {type: String, default: generate()},
    work: {type: String, ref: 'Work', autopopulate: true},
    ratingStatus: {type: String, enum: Object.keys(models.RatingOption)},
    visible: {type: Boolean, default: true},
    finishedReading: {type: Boolean, default: false},
    finishedOn: {type: Date, default: null},
    viewedOn: {type: Date, default: Date.now()},
});

export const HistorySchema = new Schema({
    _id: {type: String, default: generate()},
    owner: {type: String, ref: 'User', required: true, unique: true},
    items: {type: [HistoryItemSchema], default: null},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
}, {timestamps: true, autoIndex: true, collection: 'history'});

HistoryItemSchema.plugin(MongooseAutopopulate);
HistorySchema.plugin(MongooseAutopopulate);

HistoryItemSchema.pre<documents.HistoryItemDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('viewedOn', Date.now());

    return next();
});

HistorySchema.pre<documents.HistoryDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());

    return next();
});