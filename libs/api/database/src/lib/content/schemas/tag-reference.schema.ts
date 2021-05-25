import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TagReference, TagsModel } from '@dragonfish/shared/models/content';

@Schema({ timestamps: true })
export class TagReferenceDocument extends Types.Subdocument implements TagReference {
    @Prop({ type: String, ref: 'Tags', autopopulate: true })
    parentId: string | TagsModel;

    @Prop()
    childId: string | null;
}

export const TagReferenceSchema = SchemaFactory.createForClass(TagReferenceDocument);
