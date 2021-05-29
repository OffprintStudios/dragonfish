import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TagsModel, TagKind } from '@dragonfish/shared/models/content';

@Schema({ timestamps: true, collection: 'tags', autoIndex: true, discriminatorKey: 'kind' })
export class TagsDocument extends Document implements TagsModel {
    @Prop({ trim: true, required: true, index: 'text' })
    name: string;

    @Prop({ trim: true, required: true })
    desc: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, default: undefined, ref: 'TagsDocument', index: true })
    parent?: MongooseSchema.Types.ObjectId | string;

    @Prop({ type: String, enum: Object.keys(TagKind), required: true })
    readonly kind: TagKind;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const TagsSchema = SchemaFactory.createForClass(TagsDocument);
