import { ApprovalQueue } from "@pulp-fiction/models/approval-queue";
import { ContentKind, ContentModel } from "@pulp-fiction/models/content";
import { Decision } from "@pulp-fiction/models/contrib";

export namespace AQNamespace {
    export class GetQueue {
        static readonly type = '[ApprovalQueue] GetQueue';
        constructor (public pageNum: number) {}
    }

    export class GetQueueForMod {
        static readonly type = '[ApprovalQueue] GetQueueForMod';
        constructor (public pageNum: number) {}
    }

    export class ClaimWork {
        static readonly type = '[ApprovalQueue] ClaimWork';
        constructor (public doc: ApprovalQueue) {}
    }

    export class SelectWork {
        static readonly type = '[ApprovalQueue] SelectWork';
        constructor (public doc: ApprovalQueue | null) {}
    }

    export class ApproveWork {
        static readonly type = '[ApprovalQueue] ApproveWork';
        constructor (public decision: Decision) {}
    }

    export class RejectWork {
        static readonly type = '[ApprovalQueue] RejectWork';
        constructor (public decision: Decision) {}
    }

    export class ViewContent {
        static readonly type = '[ApprovalQueue] ViewContent';
        constructor (public contentId: string, public kind: ContentKind, public userId: string) {}
    }
}