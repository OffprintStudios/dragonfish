import { CommentHistory } from '$shared/models/comments';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true })
export class CommentHistoryDocument extends Types.Subdocument implements CommentHistory {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ required: true, trim: true })
    readonly oldBody: string;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const CommentHistorySchema = SchemaFactory.createForClass(CommentHistoryDocument);
