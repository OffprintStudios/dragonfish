import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { ContentModel } from '@pulp-fiction/models/content';
import { Document } from 'mongoose';
import { generate } from 'shortid';

@Schema({timestamps: true, autoIndex: true, collection: 'collection_items'})
export class CollectionItemDocument extends Document {
    @Prop({default: generate()})
    readonly _id: string;

    @Prop({type: String, ref: 'Collection', required: true, index: true})
    readonly belongsTo: string;

    @Prop({type: String, ref: 'Content', required: true, autopopulate: true})
    readonly content: string | ContentModel;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const CollectionItemSchema = SchemaFactory.createForClass(CollectionItemDocument);