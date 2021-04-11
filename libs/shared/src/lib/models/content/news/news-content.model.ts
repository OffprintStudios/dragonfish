import { Types } from 'mongoose';
import { PubStatus } from '../pub-status.enum';
import { ContentModel } from '../content.model';
import { NewsCategory } from './news-category.enum';
import { ContentRating } from '../content-rating.enum';

export interface NewsContentModel extends ContentModel {
    meta: {
        category: NewsCategory;
        coverPic: string;
        rating: ContentRating;
        warnings: string[];
    };
    audit: {
        featured: boolean;
        published: PubStatus;
        publishedOn: Date;
        isDeleted: boolean;
        hasComments: boolean;
    };
}
