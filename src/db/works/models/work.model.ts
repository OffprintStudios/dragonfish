import { Document } from 'mongoose';

import { Categories } from './categories.enum';
import { Fandoms } from './fandoms.enum';
import { Genres } from './genres.enum';
import { ContentRating } from './content-rating.enum';
import { WorkStatus } from './work-status.enum';
import { ApprovalStatus } from './approval-status.enum';

export interface Work extends Document {
    readonly _id: string;
    readonly author: string | AuthorInfo;
    readonly title: string;
    readonly shortDesc: string;
    readonly longDesc: string;
    readonly meta: {
        readonly category: Categories;
        readonly fandoms?: Fandoms[];
        readonly genres: Genres[];
        readonly rating: ContentRating;
        readonly status: WorkStatus;
        readonly coverArt?: string;
    };
    readonly stats: {
        readonly totWords: number;
        readonly likes: number;
        readonly dislikes: number;
        readonly views: number;
        readonly comments: number;
    };
    readonly sections?: (string|SectionInfo)[];
    readonly audit: {
        readonly threadId: string;
        readonly published: ApprovalStatus;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface AuthorInfo {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
}

interface SectionInfo {
    readonly _id: string;
    readonly title: string;
    readonly published: boolean;
    readonly stats: {
        readonly words: number;
    };
    readonly createdAt: Date;
}
