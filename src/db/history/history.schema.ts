import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import * as MongooseAutopopulate from 'mongoose-autopopulate';

import * as models from './models';

export const HistorySchema = new Schema({
    _id: {type: String, default: generate()},
    owner: {type: String, ref: 'User', required: true},
    items: [{
        work: {type: String, ref: 'Work', autopopulate: true},
        viewedOn: {type: Date},
        ratingStatus: {type: String, enum: Object.keys(models.RatingOption)},
        visible: {type: Boolean, default: false}
    }],
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
}, {timestamps: true, autoIndex: true, collection: 'history'});

HistorySchema.plugin(MongooseAutopopulate);

HistorySchema.pre<models.History>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());

    return next();
});