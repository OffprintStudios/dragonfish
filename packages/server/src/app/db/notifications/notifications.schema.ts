import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generate } from 'shortid';

@Schema()
export class NotificationsDocument extends Document {
    @Prop({default: generate()})
    readonly _id: string;

    @Prop()
    readonly userId: string;
}