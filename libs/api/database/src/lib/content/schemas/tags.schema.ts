import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TagsModel, TagKind } from '@dragonfish/shared/models/content';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, collection: 'tags', autoIndex: true, discriminatorKey: 'kind' })
export class TagsDocument extends Document implements TagsModel {
    @Prop({ type: String, default: () => nanoid() })
    readonly _id: string;

    @Prop({ trim: true, required: true, index: 'text' })
    name: string;

    @Prop({ trim: true, default: undefined })
    desc?: string;

    @Prop({ type: String, default: undefined, ref: 'TagsDocument' })
    parent?: string;

    @Prop({ type: String, enum: Object.keys(TagKind), required: true })
    readonly kind: TagKind;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const TagsSchema = SchemaFactory.createForClass(TagsDocument);
TagsSchema.index({ parent: 1, name: 1 })
