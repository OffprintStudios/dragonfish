import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BlogsContentModel, PubStatus, ContentRating, ContentKind, TagsModel } from '@dragonfish/shared/models/content';
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
        releaseOn: { type: Date, default: null },
    }))
    audit: {
        published: PubStatus;
        publishedOn: Date;
        releaseOn: Date;
        hasComments: boolean;
        isDeleted: boolean;
    };

    readonly kind: ContentKind;

    @Prop({type: [{type: String, ref: 'Tags'}] })
    tags: TagsModel[];
    
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const BlogsContentSchema = SchemaFactory.createForClass(BlogsContentDocument);
