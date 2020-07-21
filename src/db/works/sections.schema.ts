import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import * as sanitize from 'sanitize-html';

import { Section } from './models';

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
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
}, {timestamps: true, autoIndex: true, collection: 'sections'});

SectionsSchema.pre<Section>('save', async function(next: HookNextFunction) {
    this.set('_id', generate());
    this.set('title', sanitize(this.title));
    this.set('body', sanitize(this.body));
    if (this.authorsNote) {
        this.set('authorsNote', sanitize(this.authorsNote));
    }
    this.set('published', this.published);
    return next();
});