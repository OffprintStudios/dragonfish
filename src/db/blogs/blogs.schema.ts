import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import { generate } from 'shortid';
import * as sanitize from 'sanitize-html';
import * as wordCounter from '@offprintstudios/word-counter';
import { Blog } from './models';

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
}, {timestamps: true, autoIndex: true, collection: 'blogs'});

BlogsSchema.plugin(MongooseAutopopulate);

BlogsSchema.pre<Blog>('save', async function(next: HookNextFunction) {
    this.set('_id', generate());
    this.set('title', sanitize(this.title));
    this.set('body', sanitize(this.body));
    this.set('published', this.published);

    const wordCount = await wordCounter.countWords(sanitize(this.body));
    this.set('stats.words', wordCount);

    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());
    
    return next();
});

BlogsSchema.pre<Blog>('findOneAndUpdate', async function(next: HookNextFunction) {
    const wordCount = await wordCounter.countWords(sanitize(this.body));
    this.set('stats.words', wordCount);

    return next();
});
