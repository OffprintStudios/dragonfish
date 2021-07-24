import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, collection: 'content_libraries', autoIndex: true })
export class ContentLibraryDocument extends Document {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'User', index: true, required: true })
    readonly userId: string;

    @Prop({ type: String, ref: 'Content', autopopulate: true, index: true, required: true })
    readonly contentId: string;

    @Prop()
    readonly createdAt: Date;
}

export const ContentLibrarySchema = SchemaFactory.createForClass(ContentLibraryDocument);
