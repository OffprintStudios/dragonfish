import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FandomTags, SimpleTag } from "@dragonfish/shared/models/users";
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, autoIndex: true, collection: 'fandom_tags' })
export class FandomTagsDocument extends Document implements FandomTags {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true })
    desc: string;

    @Prop({ type: SimpleTag, default: null })
    parent: SimpleTag;

    @Prop({ type: [SimpleTag], default: [] })
    children: [SimpleTag]

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const FandomTagsSchema = SchemaFactory.createForClass(FandomTagsDocument);
