import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import { sanitizeHtml, stripAllHtml } from '@pulp-fiction/html_sanitizer';
import { countQuillWords, countPlaintextWords } from '@pulp-fiction/word_counter';

import { SectionDocument } from './models';

/**
 * The Mongoose schema for sections.
 */
export const SectionsSchema = new Schema({
    _id: {type: String, default: generate()},
    title: {type: String, trim: true, required: true},
    body: {type: String, trim: true, required: true},
    authorsNote: {type: String, trim: true},
    published: {type: Boolean, default: false},
    stats: {
        words: {type: Number, default: 0},
    },
    audit: {
        isDeleted: {type: Boolean, default: false},
    },
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},

    // delete once we've migrated completely from Quill
    usesFroala: {type: Boolean, default: false},
}, {timestamps: true, autoIndex: true, collection: 'sections'});

SectionsSchema.pre<SectionDocument>('save', async function(next: HookNextFunction) {
    this.set('_id', generate());
    this.set('title', await sanitizeHtml(this.title));
    this.set('body', await sanitizeHtml(this.body));
    if (this.authorsNote) {
        this.set('authorsNote', await sanitizeHtml(this.authorsNote));
    }
    this.set('published', this.published);

    const wordCount = this.usesFroala 
        ? await countPlaintextWords(await stripAllHtml(this.body))
        : await countQuillWords(await sanitizeHtml(this.body));
    this.set('stats.words', wordCount);

    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());
    
    return next();
});