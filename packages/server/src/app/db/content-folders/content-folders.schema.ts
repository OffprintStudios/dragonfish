import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Folder } from '@pulp-fiction/models/content';
import { Document, Types } from 'mongoose';

@Schema({timestamps: true, autoIndex: true, collection: 'content_folders'})
export class ContentFolderDocument extends Document implements Folder {
    @Prop()
    readonly _id: Types.ObjectId;

    @Prop({type: String, ref: 'User', index: true})
    readonly owner: string;

    @Prop({required: true})
    name: string;

    @Prop({type: [String], ref: 'User', default: null, index: true, autopopulate: {
        select: '_id username profile.avatar audit.roles'
    }})
    readonly sharedWith: string[];

    @Prop({type: [Types.ObjectId], ref: 'ContentFolder', default: [], index: true, autopopulate: true})
    readonly parents: Types.ObjectId[];

    @Prop({type: [Types.ObjectId], ref: 'ContentFolder', default: [], index: true, autopopulate: true})
    readonly children: Types.ObjectId[];

    @Prop({type: [String], ref: 'Content', default: null, autopopulate: true})
    contents: string[];

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const ContentFolderSchema = SchemaFactory.createForClass(ContentFolderDocument);