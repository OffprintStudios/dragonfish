import type { Profile } from '$lib/models/accounts';
import type { ContentRating } from './content-rating';
import type { ContentKind } from './content-kind';
import type { PubStatus } from './pub-status';
import type { Section, TagsModel } from '$lib/models/content/works';

export interface Content {
    readonly _id: string;
    readonly author: Profile;
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
    sections?: Section[];
    audit: {
        published: PubStatus;
        publishedOn: Date;
        hasComments: boolean;
        isDeleted: boolean;
    };
    readonly kind: ContentKind;
    tags?: TagsModel[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
