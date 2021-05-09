import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Tag } from '@dragonfish/shared/models/tags';

@Schema({ timestamps: true, autoIndex: true, collection: 'tags' })
export class TagsDocument extends Document implements Tag {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ trim: true, required: true })
    name: string;
    
    @Prop({ trim: true, required: false })
    desc: string;
    
    @Prop({ trim: true, required: false })
    parent: string;

    @Prop({ type: [String], ref: 'Content', default: [], autopopulate: true })
    children: string[]
    
    @Prop()
    readonly createdAt: Date;
    
    @Prop()
    readonly updatedAt: Date;

}

export const TagsSchema = SchemaFactory.createForClass(TagsDocument);
