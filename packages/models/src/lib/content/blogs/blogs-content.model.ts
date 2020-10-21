import { ContentModel } from '../content.model';

export interface BlogsContentModel extends ContentModel {
    audit: {
        published: boolean;
        publishedOn: Date;
        hasComments: boolean;
        isDeleted: boolean;
    };
}