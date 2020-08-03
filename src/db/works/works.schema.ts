import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import { v4 as uuidV4 } from 'uuid';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as sanitize from 'sanitize-html';

import * as models from './models';

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
        genres: {type: [String], enum: Object.keys(models.Genres), required: true},
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
        select: '_id title published stats.words',
    }}],
    audit: {
        threadId: {type: String, default: generate()},
        published: {type: String, enum: Object.keys(models.ApprovalStatus), default: 'NotSubmitted'},
        isDeleted: {type: Boolean, default: false}
    },
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
}, {timestamps: true, autoIndex: true, collection: 'works'});

WorksSchema.plugin(MongooseAutopopulate);

WorksSchema.pre<models.Work>('save', async function (next: HookNextFunction) {
    this.set('_id', generate());
    this.set('title', sanitize(this.title));
    this.set('shortDesc', sanitize(this.shortDesc));
    this.set('longDesc', sanitize(this.longDesc));
    this.set('meta.category', this.meta.category);
    if (this.meta.fandoms) {
        this.set('meta.fandoms', this.meta.fandoms);
    }
    this.set('meta.genres', this.meta.genres);
    this.set('meta.rating', this.meta.rating);
    this.set('meta.status', this.meta.status);
    this.set('audit.threadId', uuidV4());
    
    return next();
});
