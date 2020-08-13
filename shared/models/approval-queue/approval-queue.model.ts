import { Work } from '../works';
import { UserInfo } from '../users';

export interface ApprovalQueue {
    readonly _id: string;
    readonly workToApprove: Work;
    readonly claimedBy: UserInfo;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}