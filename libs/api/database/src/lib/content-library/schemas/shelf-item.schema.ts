import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, collection: 'bookshelf_items', autoIndex: true })
export class ShelfItemDocument extends Document {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Bookshelf', index: true })
    readonly shelfId: string;

    @Prop({ type: String, ref: 'Content', index: true, autopopulate: true })
    readonly contentId: string;

    @Prop()
    readonly createdAt: Date;
}

export const ShelfItemSchema = SchemaFactory.createForClass(ShelfItemDocument);
