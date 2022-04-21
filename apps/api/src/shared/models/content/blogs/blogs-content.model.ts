import { ContentModel } from '../content.model';
import { PubStatus } from '../pub-status.enum';
import { ContentRating } from '../content-rating.enum';

export interface BlogsContentModel extends ContentModel {
    meta: {
        rating: ContentRating;
        warnings: string[];
        banner: string;
    };
    audit: {
        published: PubStatus;
        publishedOn: Date;
        lastContentUpdate: Date;
        releaseOn: Date;
        isNewsPost: boolean;
        isFeatured: boolean;
        hasComments: boolean;
        isDeleted: boolean;
    };
}
