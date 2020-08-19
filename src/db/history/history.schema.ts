import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';

import * as documents from './models';
import * as models from 'shared/models/history';

export const HistorySchema = new Schema({
    _id: {type: String, default: generate()},
    owner: {type: String, ref: 'User', required: true},
    work: {type: String, ref: 'Work', requred: true, autopopulate: true},
    viewedOn: {type: Date, required: true},
    sectionsRead: {type: [String], ref: 'Section', default: null},
    ratingOption: {type: String, enum: Object.keys(models.RatingOption)},
    visible: {type:Boolean, default: true},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
}, {timestamps: true, autoIndex: true, collection: 'history'});

HistorySchema.plugin(MongooseAutopopulate);
HistorySchema.plugin(MongoosePaginate);

HistorySchema.pre<documents.HistoryDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());

    return next();
});