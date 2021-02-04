import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Collection } from '@dragonfish/models/collections';
import { ContentModel } from '@dragonfish/models/content';
import { Document } from 'mongoose';
import { generate } from 'shortid';

@Schema({timestamps: true, autoIndex: true, collection: 'collections'})
export class CollectionDocument extends Document implements Collection {
    @Prop()
    readonly _id: string;

    @Prop({type: String, ref: 'User', required: true})
    readonly owner: string;

    @Prop({trim: true, required: true})
    name: string;

    @Prop({trim: true, required: true})
    desc: string;

    @Prop({type: [String], ref: 'Content', default: [], autopopulate: true})
    contains: string[] | ContentModel[];

    @Prop(raw({
        isPublic: {type: Boolean, default: false},
        isDeleted: {type: Boolean, default: false}
    }))
    audit: {
        isPublic: boolean;
        readonly isDeleted: boolean;
    };

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(CollectionDocument);