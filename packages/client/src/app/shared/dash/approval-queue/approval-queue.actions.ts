import { ApprovalQueue } from "@pulp-fiction/models/approval-queue";
import { ContentKind, ContentModel } from "@pulp-fiction/models/content";
import { Decision } from "@pulp-fiction/models/contrib";

export namespace AQNamespace {
    export class GetQueue {
        static readonly type = '[ApprovalQueue] Get Queue';
        constructor (public pageNum: number) {}
    }

    export class GetQueueForMod {
        static readonly type = '[ApprovalQueue] Get Queue For Mod';
        constructor (public pageNum: number) {}
    }

    export class ClaimWork {
        static readonly type = '[ApprovalQueue] Claim Work';
        constructor (public doc: ApprovalQueue) {}
    }

    export class SelectWork {
        static readonly type = '[ApprovalQueue] Select Work';
        constructor (public doc: ApprovalQueue | null) {}
    }

    export class ApproveWork {
        static readonly type = '[ApprovalQueue] Approve Work';
        constructor (public decision: Decision) {}
    }

    export class RejectWork {
        static readonly type = '[ApprovalQueue] Reject Work';
        constructor (public decision: Decision) {}
    }

    export class ViewContent {
        static readonly type = '[ApprovalQueue] View Content';
        constructor (public contentId: string, public kind: ContentKind, public userId: string) {}
    }
}