import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
    PoetryContent,
    WorkKind,
    WorkStatus,
    Genres,
    ContentRating,
    SectionInfo,
    ContentKind,
    PubStatus,
    PoetryForm,
} from '@dragonfish/shared/models/content';
import { UserInfo } from '@dragonfish/shared/models/users';

@Schema()
export class PoetryContentDocument extends Document implements PoetryContent {
    readonly _id: string;
    readonly author: string | UserInfo;
    title: string;
    desc: string;
    body: string;
    readonly stats: { words: number; readonly views: number; likes: number; dislikes: number; readonly comments: number; };
    audit: { published: PubStatus; publishedOn: Date; hasComments: boolean; isDeleted: boolean; };
    readonly kind: ContentKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    @Prop(raw({
        category: { type: String, enum: Object.keys(WorkKind), required: true },
        form: { type: String, enum: Object.keys(PoetryForm), required: true },
        collection: { type: Boolean, default: false },
        fandoms: { type: [MongooseSchema.Types.ObjectId], default: null, ref: 'TagsDocument' },
        genres: { type: [String], enum: Object.keys(Genres), required: true },
        status: { type: String, enum: Object.keys(WorkStatus), required: true },
        coverArt: { type: String, trim: true, default: null },
    }))
    meta: {
        category: WorkKind;
        form: PoetryForm;
        collection: boolean;
        fandoms: string[] | null;
        genres: Genres[];
        rating: ContentRating;
        status: WorkStatus;
        warnings: string[];
        coverArt?: string
    };

    @Prop({
        type: [String],
        ref: 'Sections',
        default: null,
        autopopulate: {
            select: '_id title published stats.words audit.publishedOn createdAt updatedAt',
            match: { 'audit.isDeleted': false },
        },
    })
    sections?: string[] | SectionInfo[];
}

export const PoetryContentSchema = SchemaFactory.createForClass(PoetryContentDocument);
