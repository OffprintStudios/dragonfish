import { UserInfo } from '../users';

export interface Blog {
    readonly _id: string;
    readonly author: UserInfo;
    readonly title: string;
    readonly body: string;
    readonly published: boolean;
    readonly stats: {
        readonly comments: number;
        readonly views: number;
        readonly words: number;
        readonly likes: number;
        readonly dislikes: number;
    };
    readonly audit: {
        readonly isDeleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;

    // Remove this once we've finished migrating away from Quill
    readonly usesNewEditor: boolean;
}
