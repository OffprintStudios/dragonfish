import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RatingsModel, RatingOption } from '$shared/models/ratings';

@Schema({ timestamps: true, collection: 'ratings', autoIndex: true })
export class RatingsDocument extends Document implements RatingsModel {
    @Prop({ type: String, ref: 'Content', required: true, index: true })
    readonly contentId: string;

    @Prop({ type: String, ref: 'Account', required: true, index: true })
    readonly userId: string;

    @Prop({
        type: String,
        enum: Object.keys(RatingOption),
        default: RatingOption.NoVote,
        index: true,
    })
    rating: RatingOption;

    @Prop()
    readonly createdAt: Date;
}

export const RatingsSchema = SchemaFactory.createForClass(RatingsDocument);
