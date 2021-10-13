import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ContentCommentDocument extends Document {}

export const ContentCommentSchema = SchemaFactory.createForClass(ContentCommentDocument);
