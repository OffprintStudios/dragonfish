import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generate } from 'shortid';

import { NewsPost, NewsCategory, PostUser, PostStats, PostAudit } from '@pulp-fiction/models/news';

@Schema({timestamps: true, autoIndex: true, collection: 'news'})
export class NewsDocument extends Document implements NewsPost {
    @Prop({default: generate()})
    readonly _id: string;

    @Prop({type: String, ref: 'User', autopopulate: {
        select: '_id username profile.avatar audit.roles'
    }})
    readonly user: string | PostUser;

    @Prop({trim: true, required: true})
    title: string;

    @Prop({trim: true, required: true})
    desc: string;

    @Prop({trim: true, required: true})
    body: string;

    @Prop({type: String, enum: Object.keys(NewsCategory), required: true, index: true})
    category: NewsCategory;

    @Prop({type: String, trim: true, default: null})
    coverPic: string;

    @Prop(raw({
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
        comments: {type: Number, default: 0},
        words: {type: Number, default: 0},
        views: {type: Number, default: 0}
    }))
    stats: PostStats;

    @Prop(raw({
        featured: {type: Boolean, default: false},
        published: {type: Boolean, default: false},
        publishedOn: {type: Date},
        isDeleted: {type: Boolean, default: false}
    }))
    audit: PostAudit;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(NewsDocument);