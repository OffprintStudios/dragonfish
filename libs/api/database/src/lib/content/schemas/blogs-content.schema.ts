import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BlogsContentModel, PubStatus, ContentRating, ContentKind } from '@dragonfish/shared/models/content';
import { UserInfo } from '@dragonfish/shared/models/users';

@Schema()
export class BlogsContentDocument extends Document implements BlogsContentModel {
    readonly _id: string;
    readonly author: string | UserInfo;
    title: string;
    desc: string;
    body: string;
    meta: { rating: ContentRating; warnings: string[] };
    readonly stats: { words: number; readonly views: number; likes: number; dislikes: number; readonly comments: number };

    @Prop(raw({
        published: { type: String, enum: Object.keys(PubStatus), default: 'Unpublished' },
        publishedOn: { type: Date, default: null },
        releaseOn: { type: Date, default: null },
        hasComments: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    }))
    audit: {
        published: PubStatus;
        publishedOn: Date;
        releaseOn: Date;
        hasComments: boolean;
        isDeleted: boolean;
    };

    readonly kind: ContentKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const BlogsContentSchema = SchemaFactory.createForClass(BlogsContentDocument);
