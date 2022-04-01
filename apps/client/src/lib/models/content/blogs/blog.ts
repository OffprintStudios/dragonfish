import type { Content } from '../content';
import type { PubStatus } from '../pub-status';
import type { ContentRating } from '../content-rating';

export interface Blog extends Content {
    meta: {
        rating: ContentRating;
        warnings: string[];
        banner: string;
    };
    audit: {
        published: PubStatus;
        publishedOn: Date;
        releaseOn: Date;
        isNewsPost: boolean;
        isFeatured: boolean;
        hasComments: boolean;
        isDeleted: boolean;
    };
}
