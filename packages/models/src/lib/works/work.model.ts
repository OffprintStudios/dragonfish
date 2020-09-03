import { Categories } from './categories.enum';
import { Fandoms } from './fandoms.enum';
import { Genres } from './genres.enum';
import { ContentRating } from './content-rating.enum';
import { WorkStatus } from './work-status.enum';
import { ApprovalStatus } from './approval-status.enum';

export interface Work {
    readonly _id: string;
    readonly author: AuthorInfo;
    readonly title: string;
    readonly shortDesc: string;
    readonly longDesc: string;
    readonly meta: WorkMetadata;
    readonly stats: {
        readonly totWords: number;
        readonly likes: number;
        readonly dislikes: number;
        readonly views: number;
        readonly comments: number;
    };
    readonly sections?: SectionInfo[];
    readonly audit: {
        readonly hasComments: boolean;
        readonly published: ApprovalStatus;
        readonly publishedOn: Date;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;

    // Remove this once we've migrated all sections from Quill
    readonly usesNewEditor: boolean;
}

export interface AuthorInfo {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
}

export interface SectionInfo {
    readonly _id: string;
    readonly title: string;
    readonly published: boolean;
    readonly stats: {
        readonly words: number;
    };
    readonly createdAt: Date;
}

export interface WorkMetadata {
    readonly category: Categories;
    readonly fandoms?: Fandoms[];
    readonly genres: Genres[];
    readonly rating: ContentRating;
    readonly status: WorkStatus;
    readonly coverArt?: string;
}
