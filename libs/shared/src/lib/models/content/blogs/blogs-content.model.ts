import { ContentModel } from '../content.model';
import { PubStatus } from '../pub-status.enum';

export interface BlogsContentModel extends ContentModel {
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
