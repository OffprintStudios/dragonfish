import { UserInfo } from '../users';
import { ContentModel } from '../content';

export interface ApprovalQueue {
    readonly _id: string;
    readonly workToApprove: string | ContentModel;
    readonly claimedBy: string | UserInfo;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
