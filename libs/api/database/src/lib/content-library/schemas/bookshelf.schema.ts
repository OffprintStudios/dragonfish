import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Bookshelf } from '@dragonfish/shared/models/users/content-library';

@Schema({ timestamps: true, collection: 'bookshelves', autoIndex: true })
export class BookshelfDocument extends Document implements Bookshelf {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Account', index: true, required: true })
    readonly userId: string;

    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, default: null })
    desc: string;

    @Prop({ trim: true, default: null })
    coverPic: string;

    @Prop({ default: false })
    public: boolean;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const BookshelfSchema = SchemaFactory.createForClass(BookshelfDocument);
