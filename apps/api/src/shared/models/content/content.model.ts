import { PubStatus } from './pub-status.enum';
import { ContentKind } from './content-kind.enum';
import { ContentRating } from './content-rating.enum';
import { Pseudonym } from '../accounts';
import { TagsModel } from './tags';

export interface ContentModel {
    readonly _id: string;
    readonly author: string | Pseudonym;
    title: string;
    desc: string;
    body: string;
    meta: {
        rating: ContentRating;
        warnings: string[];
    };
    readonly stats: {
        words: number;
        readonly views: number;
        likes: number;
        dislikes: number;
        readonly comments: number;
    };
    audit: {
        published: PubStatus;
        publishedOn: Date;
        lastContentUpdate: Date;
        hasComments: boolean;
        isDeleted: boolean;
    };
    readonly kind: ContentKind;
    tags?: string[] | TagsModel[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
