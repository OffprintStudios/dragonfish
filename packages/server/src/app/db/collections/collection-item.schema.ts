import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { ContentModel } from '@pulp-fiction/models/content';
import { Document } from 'mongoose';

@Schema({timestamps: true, autoIndex: true, collection: 'coll_items'})
export class CollectionItemDocument extends Document {
    @Prop()
    readonly _id: string;

    @Prop()
    readonly belongsTo: string;

    @Prop()
    readonly content: string | ContentModel;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const CollectionItemSchema = SchemaFactory.createForClass(CollectionItemDocument);