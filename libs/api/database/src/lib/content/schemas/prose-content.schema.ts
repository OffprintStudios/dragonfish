import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
    ProseContent,
    WorkKind,
    WorkStatus,
    Genres,
    ContentRating,
    SectionInfo,
    ContentKind,
    PubStatus,
} from '@dragonfish/shared/models/content';
import { UserInfo } from '@dragonfish/shared/models/users';

@Schema()
export class ProseContentDocument extends Document implements ProseContent {
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
        fandoms: { type: [MongooseSchema.Types.ObjectId], default: null, ref: 'TagsDocument' },
        genres: { type: [String], enum: Object.keys(Genres), required: true },
        status: { type: String, enum: Object.keys(WorkStatus), required: true },
        coverArt: { type: String, trim: true, default: null },
    }))
    meta: {
        category: WorkKind;
        fandoms: string[] | null;
        genres: Genres[];
        rating: ContentRating;
        warnings: string[];
        status: WorkStatus;
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
    sections: string[] | SectionInfo[];
}

export const ProseContentSchema = SchemaFactory.createForClass(ProseContentDocument);
