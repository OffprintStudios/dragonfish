import { UserInfo } from '../users';
import { PubStatus } from './pub-status.enum';
import { ContentKind } from './content-kind.enum';

export interface ContentModel {
    readonly _id: string;
    readonly author: string | UserInfo;
    title: string;
    desc: string;
    body: string;
    readonly stats: {
        words: number;
        readonly views: number;
        readonly likes: number;
        readonly dislikes: number;
        readonly comments: number;
    };
    audit: {
        published: PubStatus;
        publishedOn: Date;
        hasComments: boolean;
        isDeleted: boolean;
    };
    readonly kind: ContentKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}