import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TagsModel, TagKind } from '@dragonfish/shared/models/content/tags';
import { nanoid } from 'nanoid';

/**
 * Note that a compound index is defined at the bottom of this file
 */
@Schema({ timestamps: true, collection: 'tags', autoIndex: true, discriminatorKey: 'kind' })
export class TagsDocument extends Document implements TagsModel {
    @Prop({ type: String, default: () => nanoid() })
    readonly _id: string;

    @Prop({ trim: true, required: true, index: 'text' })
    name: string;

    @Prop({ trim: true, default: null })
    desc?: string;

    @Prop({
        type: String,
        default: null,
        ref: 'Tags',
        autopopulate: {
            select: '_id name desc parent kind createdAt updatedAt',
        },
    })
    parent?: string | TagsModel;

    @Prop({ type: String, enum: Object.keys(TagKind), required: true })
    readonly kind: TagKind;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const TagsSchema = SchemaFactory.createForClass(TagsDocument);
TagsSchema.index({ parent: 1, name: 1 })
