import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NewsContentModel, PubStatus, NewsCategory, ContentRating, ContentKind } from '@dragonfish/shared/models/content';
import { UserInfo } from '@dragonfish/shared/models/users';

@Schema()
export class NewsContentDocument extends Document implements NewsContentModel {
    readonly _id: string;
    readonly author: string | UserInfo;
    body: string;
    readonly createdAt: Date;
    desc: string;
    readonly kind: ContentKind;
    readonly stats: { words: number; readonly views: number; likes: number; dislikes: number; readonly comments: number };
    title: string;
    readonly updatedAt: Date;

    @Prop(raw({
        featured: { type: Boolean, default: false },
        releaseOn: { type: Date, default: null },
    }))
    audit: {
        featured: boolean;
        published: PubStatus;
        publishedOn: Date;
        releaseOn: Date;
        isDeleted: boolean;
        hasComments: boolean
    };

    @Prop(raw({
        category: { type: String, enum: Object.keys(NewsCategory), required: true, index: true },
        coverPic: { type: String, default: null },
        rating: { type: String, enum: Object.keys(ContentRating), default: ContentRating.Everyone },
        warnings: { type: [String], default: null },
    }))
    meta: {
        category: NewsCategory;
        coverPic: string;
        rating: ContentRating;
        warnings: string[]
    };
}

export const NewsContentSchema = SchemaFactory.createForClass(NewsContentDocument);
