import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
    BlogsContentModel,
    PubStatus,
    ContentRating,
    ContentKind,
    TagsModel,
} from '$shared/models/content';
import { Pseudonym } from '$shared/models/accounts';

@Schema()
export class BlogsContentDocument extends Document implements BlogsContentModel {
    readonly _id: string;
    readonly author: string | Pseudonym;
    title: string;
    desc: string;
    body: string;
    readonly stats: {
        words: number;
        readonly views: number;
        likes: number;
        dislikes: number;
        readonly comments: number;
    };

    @Prop(
        raw({
            rating: { type: String, enum: Object.keys(ContentRating), required: true, index: true },
            warnings: { type: [String], default: null },
            banner: { type: String, default: null },
        }),
    )
    meta: {
        rating: ContentRating;
        warnings: string[];
        banner: string;
    };

    @Prop(
        raw({
            releaseOn: { type: Date, default: null },
            isNewsPost: { type: Boolean, default: false },
            isFeatured: { type: Boolean, default: false },
        }),
    )
    audit: {
        published: PubStatus;
        publishedOn: Date;
        lastContentUpdate: Date;
        releaseOn: Date;
        isNewsPost: boolean;
        isFeatured: boolean;
        hasComments: boolean;
        isDeleted: boolean;
    };

    readonly kind: ContentKind;

    @Prop({ type: [{ type: String, ref: 'Tags' }] })
    tags: TagsModel[];

    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const BlogsContentSchema = SchemaFactory.createForClass(BlogsContentDocument);
