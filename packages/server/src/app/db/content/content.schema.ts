import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { ContentModel } from '@pulp-fiction/models/content';
import { Document } from 'mongoose';
import { generate } from 'shortid';

@Schema({timestamps: true, autoIndex: true, collection: 'content', discriminatorKey: 'kind'})
export class ContentDocument extends Document implements ContentModel {
    @Prop({default: generate()})
    readonly _id: string;

    @Prop({type: String, ref: 'User', required: true, autopopulate: {
        select: '_id username profile.avatar audit.roles'
    }})
    readonly author: string;

    @Prop({trim: true, required: true})
    title: string;

    @Prop({trim: true})
    desc: string;

    @Prop({trim: true, required: true})
    body: string;

    @Prop(raw({
        words: {type: Number, default: 0},
        views: {type: Number, default: 0},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
        comments: {type: Number, default: 0}
    }))
    readonly stats: {
        words: number;
        readonly views: number;
        readonly likes: number;
        readonly dislikes: number;
        readonly comments: number;
    };

    @Prop()
    readonly kind: string;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const ContentSchema = SchemaFactory.createForClass(ContentDocument);