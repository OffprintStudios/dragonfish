import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as sanitize from 'sanitize-html';
import * as wordCounter from '@offprintstudios/word-counter';

import * as documents from './models';
import { Roles } from 'shared/models/users';

export const DocsSchema = new Schema({
    _id: {type: String, default: generate()},
    contributors: {type: [String], ref: 'User', autopopulate: {
        select: '_id username profile.avatar',
    }},
    docName: {type: String, required: true, trim: true},
    docDescription: {type: String, required: true, trim: true},
    docBody: {type: String, required: true, trim: true},
    words: {type: Number, default: 0},
    audit: {
        approvedRoles: {type: [String], enum: Object.keys(Roles), required: true},
        lastUpdatedBy: {type: String, ref: 'User', default: null, autopopulate: {
            select: '_id username profile.avatar',
        }},
        isDeleted: {type: Boolean, default: false},
    },
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
}, {timestamps: true, autoIndex: true, collection: 'docs'});

DocsSchema.plugin(MongooseAutopopulate);

DocsSchema.pre<documents.DocDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', sanitize(this._id));
    this.set('docName', sanitize(this.docName));
    this.set('docDescription', sanitize(this.docDescription));
    this.set('docBody', sanitize(this.docBody));
    this.set('words', wordCounter.countWords(sanitize(this.docBody)));
    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());

    return next();
});