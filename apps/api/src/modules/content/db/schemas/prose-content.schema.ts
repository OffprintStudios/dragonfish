import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
    ProseContent,
    WorkKind,
    WorkStatus,
    Genres,
    ContentRating,
    ContentKind,
    PubStatus,
    TagsModel,
} from '$shared/models/content';
import { Pseudonym } from '$shared/models/accounts';
import { Section } from '$shared/models/sections';

@Schema()
export class ProseContentDocument extends Document implements ProseContent {
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
    audit: {
        published: PubStatus;
        publishedOn: Date;
        lastContentUpdate: Date;
        hasComments: boolean;
        isDeleted: boolean;
    };
    readonly kind: ContentKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    @Prop(
        raw({
            category: { type: String, enum: Object.keys(WorkKind), required: true },
            genres: { type: [String], enum: Object.keys(Genres), required: true },
            status: { type: String, enum: Object.keys(WorkStatus), required: true },
            coverArt: { type: String, trim: true, default: null },
        }),
    )
    meta: {
        category: WorkKind;
        genres: Genres[];
        rating: ContentRating;
        warnings: string[];
        status: WorkStatus;
        coverArt?: string;
    };

    @Prop({
        type: [String],
        ref: 'Sections',
        default: null,
    })
    sections: string[] | Section[];

    @Prop({ type: [{ type: String, ref: 'Tags' }] })
    tags?: string[] | TagsModel[];
}

export const ProseContentSchema = SchemaFactory.createForClass(ProseContentDocument);
