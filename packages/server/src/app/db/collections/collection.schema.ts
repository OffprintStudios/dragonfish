import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generate } from 'shortid';

@Schema({timestamps: true, autoIndex: true, collection: 'collections'})
export class CollectionDocument extends Document {
    @Prop({default: generate()})
    readonly _id: string;

    @Prop({type: String, ref: 'User', required: true})
    readonly owner: string;

    @Prop({trim: true, required: true})
    name: string;

    @Prop({trim: true, required: true})
    desc: string;

    @Prop({type: [String], ref: 'Content', default: [], autopopulate: {
        select: '_id title author stats.words stats.views'
    }})
    contains: string[];

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