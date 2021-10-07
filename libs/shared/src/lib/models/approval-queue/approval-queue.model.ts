import { ContentModel } from '../content';
import { Pseudonym } from '../accounts';

export interface ApprovalQueue {
    readonly _id: string;
    readonly workToApprove: string | ContentModel;
    readonly claimedBy: string | Pseudonym;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
