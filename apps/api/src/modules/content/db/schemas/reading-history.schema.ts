import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ContentModel } from '$shared/models/content';
import { ReadingHistory } from '$shared/models/reading-history';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, autoIndex: true, collection: 'reading_history' })
export class ReadingHistoryDocument extends Document implements ReadingHistory {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ ref: 'Account', required: true, index: true })
    readonly owner: string;

    @Prop({ type: String, ref: 'Content', required: true })
    readonly content: string | ContentModel;

    @Prop({ required: true })
    readonly viewedOn: Date;

    @Prop({ type: [String], ref: 'Section', default: null })
    sectionsRead: string[];

    @Prop({ default: true })
    visible: boolean;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const ReadingHistorySchema = SchemaFactory.createForClass(ReadingHistoryDocument);
