import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { ContentModel, ContentKind, PubStatus, ContentRating, TagsModel } from '@dragonfish/shared/models/content';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { nanoid } from 'nanoid';
import { UserInfo } from '@dragonfish/shared/models/users';

@Schema({ timestamps: true, autoIndex: true, collection: 'content', discriminatorKey: 'kind' })
export class ContentDocument extends Document implements ContentModel {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({
        type: String,
        ref: 'User',
        required: true,
        autopopulate: {
            select: '_id username profile.avatar audit.roles',
        },
    })
    readonly author: string | UserInfo;

    @Prop({ trim: true, required: true })
    title: string;

    @Prop({ trim: true })
    desc: string;

    @Prop({ trim: true, required: true })
    body: string;

    @Prop(
        raw({
            rating: { type: String, enum: Object.keys(ContentRating), required: true, index: true },
            warnings: { type: [String], default: null },
        })
    )
    meta: {
        rating: ContentRating;
        warnings: string[];
    };

    @Prop(
        raw({
            words: { type: Number, default: 0 },
            views: { type: Number, default: 0 },
            likes: { type: Number, default: 0 },
            dislikes: { type: Number, default: 0 },
            comments: { type: Number, default: 0 },
        })
    )
    readonly stats: {
        words: number;
        readonly views: number;
        readonly likes: number;
        readonly dislikes: number;
        readonly comments: number;
    };

    @Prop(
        raw({
            published: { type: String, enum: Object.keys(PubStatus), default: 'Unpublished' },
            publishedOn: { type: Date, default: null },
            hasComments: { type: Boolean, default: true },
            isDeleted: { type: Boolean, default: false },
        })
    )
    audit: {
        published: PubStatus;
        publishedOn: Date;
        hasComments: boolean;
        isDeleted: boolean;
    };

    @Prop({ type: String, enum: Object.keys(ContentKind), index: true })
    readonly kind: ContentKind;

    @Prop({type: [{type: String, ref: 'TagsDocument'}] })
    tags: TagsModel[];

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const ContentSchema = SchemaFactory.createForClass(ContentDocument);
