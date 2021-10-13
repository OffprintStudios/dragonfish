import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ContentUpdatedDocument extends Document {}

export const ContentUpdatedSchema = SchemaFactory.createForClass(ContentUpdatedDocument);
