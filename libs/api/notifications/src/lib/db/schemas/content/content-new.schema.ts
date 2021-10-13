import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ContentNewDocument extends Document {}

export const ContentNewSchema = SchemaFactory.createForClass(ContentNewDocument);
