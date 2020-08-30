import { Roles, UserInfo } from '../users';

export interface Doc {
    readonly _id: string;
    readonly contributors: UserInfo[];
    readonly docName: string;
    readonly docDescription: string;
    readonly docBody: string;
    readonly audit: {
        readonly approvedRoles: Roles[];
        readonly lastUpdatedBy: UserInfo;
        readonly isDeleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;

    // Remove this once we've migrated away from Quill
    readonly usesFroala: boolean;
}