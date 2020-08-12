import { Document } from 'mongoose';

import { Roles } from 'src/db/users/models';

export interface Doc extends Document {
    readonly _id: string;
    readonly contributors: string[] | UserInfo[];
    readonly docName: string;
    readonly docBody: string;
    readonly audit: {
        readonly approvedRoles: Roles[];
        readonly lastUpdatedBy: string | UserInfo;
        readonly isDeleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface UserInfo {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
}