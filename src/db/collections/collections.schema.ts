import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import { generate } from 'shortid';
import * as sanitize from 'sanitize-html';

import { Collection } from './models';

/**
 * The Collections schema
 */
export const CollectionsSchema = new Schema({
    _id: {type: String, default: generate()},
    owner: {type: String, ref: 'User', required: true},
    name: {type: String, trim: true, default: 'Untitled Collection'},
    details: [{
        work: {type: String, ref: 'Work', autopopulate: {
            select: '_id author title shortDesc stats.totWords'
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

CollectionsSchema.pre<Collection>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('name', sanitize(this.name));
    this.set('details', null);
    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());

    return next();
});