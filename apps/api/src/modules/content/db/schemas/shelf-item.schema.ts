import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { ContentModel } from '$shared/models/content';
import { ShelfItem } from '$shared/models/content-library';

@Schema({ timestamps: true, collection: 'bookshelf_items', autoIndex: true })
export class ShelfItemDocument extends Document implements ShelfItem {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Bookshelf', index: true, required: true })
    readonly shelfId: string;

    @Prop({ type: String, ref: 'Content', index: true, autopopulate: true, required: true })
    readonly content: string | ContentModel;

    @Prop()
    readonly createdAt: Date;
}

export const ShelfItemSchema = SchemaFactory.createForClass(ShelfItemDocument);
