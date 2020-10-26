import { Types } from 'mongoose';
import { ContentModel } from '../content.model';

export interface BlogsContentModel extends ContentModel {
    audit: {
        published: boolean;
        publishedOn: Date;
        releaseOn: Date;
        hasComments: boolean;
        isDeleted: boolean;
        path: string[];
        selected: boolean;
        childOf: Types.ObjectId;
    };
}