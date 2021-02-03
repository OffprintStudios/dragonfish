import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import { generate } from 'shortid';
import { countQuillWords, countPlaintextWords } from '@dragonfish/word_counter';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { sanitizeHtml, stripAllHtml } from '@dragonfish/html_sanitizer';

import * as documents from './models/blog-document.model';

/**
 * The Mongoose schema for blogs.
 */
export const BlogsSchema = new Schema({
    _id: {type: String, default: generate()},
    author: {type: String, ref: 'User', required: true, autopopulate: {
        select: '_id username profile.avatar',
    }},
    title: {type: String, trim: true, required: true},
    body: {type: String, trim: true, required: true},
    published: {type: Boolean, default: false},
    stats: {
        comments: {type: Number, default: 0},
        views: {type: Number, default: 0},
        words: {type: Number, default: 0},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0}
    },
    audit: {
        isDeleted: {type: Boolean, default: false},
    },
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},

    // Remove once we've migrated away from Quill
    usesNewEditor: {type: Boolean, default: false}
}, {timestamps: true, autoIndex: true, collection: 'blogs'});

BlogsSchema.index({title: 'text'})

BlogsSchema.plugin(MongooseAutopopulate);
BlogsSchema.plugin(MongoosePaginate);

BlogsSchema.pre<documents.BlogDocument>('save', async function(next: HookNextFunction) {
    this.set('_id', generate());
    this.set('title', await sanitizeHtml(this.title));
    this.set('body', await sanitizeHtml(this.body));
    this.set('published', this.published);

    const wordCount = this.usesNewEditor 
        ? await countPlaintextWords(await stripAllHtml(this.body))
        : await countQuillWords(await sanitizeHtml(this.body));
    this.set('stats.words', wordCount);

    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());
    
    return next();
});
