import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { ChildTagsModel, TagsModel } from '@dragonfish/shared/models/content';

@Schema({ timestamps: true })
export class ChildTags extends Types.Subdocument implements ChildTagsModel {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, required: true })
    desc: string;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const ChildTagsSchema = SchemaFactory.createForClass(ChildTags);

@Schema({ timestamps: true, collection: 'tags', autoIndex: true, discriminatorKey: 'kind' })
export class TagsDocument extends Document implements TagsModel {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ trim: true, required: true, index: 'text' })
    name: string;

    @Prop({ trim: true, required: true })
    desc: string;

    @Prop({ type: [ChildTagsSchema], default: [] })
    children: ChildTags[];

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const TagsSchema = SchemaFactory.createForClass(TagsDocument);
