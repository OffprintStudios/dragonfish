import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generate } from 'shortid';

import { UserInfoComments } from '@pulp-fiction/models/comments';

@Schema()
export class MessageDocument extends Document {
    @Prop({default: generate()})
    readonly _id: string;
}