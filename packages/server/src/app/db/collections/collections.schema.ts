import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CollectionsDocument extends Document {
    @Prop()
    readonly _id: string;

    @Prop()
    readonly user: string;

    @Prop()
    name: string;

    @Prop()
    desc?: string;

    @Prop()
    details;
}