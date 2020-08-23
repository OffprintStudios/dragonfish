import { Schema, HookNextFunction, model } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import * as sanitize from 'sanitize-html';
import { generate } from 'shortid';

import { CommentDocument } from './models';

export const CommentsSchema = new Schema({
    _id: {type: String, default: generate()},
    user: {type: String, ref: 'User', required: true, autopopulate: {
        select: '_id username profile.avatar profile.tagline audit.roles'
    }},
    body: {type: String, required: true, trim: true},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
}, {discriminatorKey: 'kind', autoIndex: true, timestamps: true, collection: 'comments'});

CommentsSchema.plugin(MongooseAutopopulate);
CommentsSchema.plugin(MongoosePaginate);

CommentsSchema.pre<CommentDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('body', sanitize(this.body));
    this.set('createdAt', new Date());
    this.set('updatedAt', new Date());

    return next();
});