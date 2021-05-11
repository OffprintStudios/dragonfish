import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RatingsModel } from '@dragonfish/shared/models/ratings';

@Schema({ timestamps: true, collection: 'ratings', autoIndex: true })
export class RatingsDocument extends Document implements RatingsModel {
    @Prop({ type: String, ref: 'Content', required: true }) readonly _id: string;
    @Prop({ type: [String], default: [] }) likes: string[];
    @Prop({ type: [String], default: [] }) dislikes: string[];
}

export const RatingsSchema = SchemaFactory.createForClass(RatingsDocument);
