import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import { v4 as uuidV4 } from 'uuid';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';

import * as models from '@pulp-fiction/models/works';
import * as documents from './models';

/**
 * The Mongoose schema for works.
 */
export const WorksSchema = new Schema({
    _id: {type: String, default: generate()},
    author: {type: String, ref: 'User', required: true, autopopulate: {
        select: '_id username profile.avatar',
    }},
    title: {type: String, trim: true, required: true},
    shortDesc: {type: String, trim: true, required: true},
    longDesc: {type: String, trim: true, required: true},
    meta: {
        category: {type: String, enum: Object.keys(models.Categories), required: true},
        fandoms: {type: [String], enum: Object.keys(models.Fandoms)},
        genres: {type: [String], enum: Object.keys(models.GenresFiction).concat(Object.keys(models.GenresPoetry)), required: true},
        rating: {type: String, enum: Object.keys(models.ContentRating), required: true},
        status: {type: String, enum: Object.keys(models.WorkStatus), required: true},
        coverArt: {type: String},
    },
    stats: {
        totWords: {type: Number, default: 0},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
        views: {type: Number, default: 0},
        comments: {type: Number, default: 0},
    },
    sections: [{type: String, ref: 'Section', autopopulate: {
        select: '_id title published stats.words createdAt',
        match: {'audit.isDeleted': false},
    }}],
    audit: {
        threadId: {type: String, default: generate()},
        published: {type: String, enum: Object.keys(models.ApprovalStatus), default: 'NotSubmitted'},
        publishedOn: {type: Date, default: null},
        isDeleted: {type: Boolean, default: false}
    },
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},

    // delete once we've migrated completely from Quill
    usesNewEditor: {type: Boolean, default: false},
}, {timestamps: true, autoIndex: true, collection: 'works'});

WorksSchema.plugin(MongooseAutopopulate);
WorksSchema.plugin(MongoosePaginate);

WorksSchema.pre<documents.WorkDocument>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('title', await sanitizeHtml(this.title));
    this.set('shortDesc', await sanitizeHtml(this.shortDesc));
    this.set('longDesc', await sanitizeHtml(this.longDesc));
    this.set('meta.category', this.meta.category);
    if (this.meta.fandoms) {
        this.set('meta.fandoms', this.meta.fandoms);
    }
    this.set('meta.genres', this.meta.genres);
    this.set('meta.rating', this.meta.rating);
    this.set('meta.status', this.meta.status);
    this.set('audit.threadId', uuidV4());

    this.set('createdAt', Date.now());
    this.set('updatedAt', Date.now());
    
    return next();
});
