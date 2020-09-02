import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import { sanitizeHtml, stripAllHtml } from '@pulp-fiction/html_sanitizer';
import { countQuillWords, countPlaintextWords } from '@pulp-fiction/word_counter';

import * as documents from './models';
import { Roles } from '@pulp-fiction/models/users';

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

    // Remove once we've migrated away from Quill
    usesNewEditor: {type: Boolean, default: false}
}, {timestamps: true, autoIndex: true, collection: 'docs'});

DocsSchema.plugin(MongooseAutopopulate);

DocsSchema.pre<documents.DocDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', await sanitizeHtml(this._id));
    this.set('docName', await sanitizeHtml(this.docName));
    this.set('docDescription', await sanitizeHtml(this.docDescription));
    this.set('docBody', await sanitizeHtml(this.docBody));
    const wordCount = this.usesNewEditor
        ? await countPlaintextWords(await stripAllHtml(this.docBody))
        : await countQuillWords(await sanitizeHtml(this.docBody));
    this.set('words', wordCount);
    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());

    return next();
});