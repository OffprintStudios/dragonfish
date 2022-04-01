import type { ContentModel } from '../../content';
import type { Pseudonym } from '../../accounts';

export interface ApprovalQueue {
    readonly _id: string;
    readonly workToApprove: string | ContentModel;
    claimedBy: string | Pseudonym;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
