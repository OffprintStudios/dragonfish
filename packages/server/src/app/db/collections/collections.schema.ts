import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { generate } from 'shortid';
import * as sanitize from 'sanitize-html';

import { CollectionDocument } from './models';

/**
 * The Collections schema
 */
export const CollectionsSchema = new Schema({
    _id: {type: String, default: generate()},
    user: {type: String, ref: 'User', required: true},
    name: {type: String, trim: true, default: 'Untitled Collection'},
    desc: {type: String, trim: true},
    details: [{
        work: {type: String, ref: 'Work', autopopulate: {
            select: '_id author title shortDesc meta stats createdAt'
        }},
        addedOn: {type: Date},
    }],
    audit: {
        isPublic: {type: Boolean, default: false},
        isDeleted: {type: Boolean, default: false},
    },
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
}, {timestamps: true, autoIndex: true, collection: 'collections'});

CollectionsSchema.plugin(MongooseAutopopulate);
CollectionsSchema.plugin(MongoosePaginate);

CollectionsSchema.pre<CollectionDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('name', sanitize(this.name));
    this.set('desc', sanitize(this.desc));
    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());

    return next();
});