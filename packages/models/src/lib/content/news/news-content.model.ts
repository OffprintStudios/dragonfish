import { Types } from 'mongoose';
import { ContentModel } from '../content.model';
import { NewsCategory } from './news-category.enum';

export interface NewsContentModel extends ContentModel {
    meta: {
        category: NewsCategory;
        coverPic: string;
    };
    audit: {
        featured: boolean;
        published: boolean;
        publishedOn: Date;
        isDeleted: boolean;
        hasComments: boolean;
        path: string[];
        selected: boolean;
        childOf: Types.ObjectId;
    };
}