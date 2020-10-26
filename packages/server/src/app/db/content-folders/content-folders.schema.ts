import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ContentFolderDocument extends Document {
    @Prop()
    readonly _id: Types.ObjectId;

    @Prop({index: true})
    readonly owner: string;

    @Prop()
    readonly sharedWith: string[];

    @Prop({type: [Types.ObjectId], default: null})
    readonly parents: Types.ObjectId[];

    @Prop({type: [String], ref: 'Content', default: null, autopopulate: true})
    contents: string[];

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const ContentFolderSchema = SchemaFactory.createForClass(ContentFolderDocument);