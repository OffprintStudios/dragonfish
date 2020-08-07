import { Work } from '../works';

export interface ApprovalQueue {
    readonly _id: string;
    readonly workToApprove: Work;
    readonly claimedBy: UserInfo;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

interface UserInfo {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
}