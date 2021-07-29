import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { ContentModel } from '@dragonfish/shared/models/content';
import { ContentLibrary } from '@dragonfish/shared/models/users/content-library';

@Schema({ timestamps: true, collection: 'content_libraries', autoIndex: true })
export class ContentLibraryDocument extends Document implements ContentLibrary {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'User', index: true, required: true })
    readonly userId: string;

    @Prop({ type: String, ref: 'Content', autopopulate: true, index: true, required: true })
    readonly content: string | ContentModel;

    @Prop()
    readonly createdAt: Date;
}

export const ContentLibrarySchema = SchemaFactory.createForClass(ContentLibraryDocument);
