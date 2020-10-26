import { UserInfo } from '@pulp-fiction/models/users';
import { Types } from 'mongoose';

export interface Folder {
    readonly _id: Types.ObjectId;
    readonly owner: string | UserInfo;
    name: string;
    readonly sharedWith: string[] | UserInfo[];
    readonly parents: Types.ObjectId[];
    readonly children: Types.ObjectId[];
    contents: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}