import { ApprovalQueue } from '@dragonfish/models/approval-queue';
import { ContentKind, ContentModel } from '@dragonfish/models/content';
import { Decision } from '@dragonfish/models/contrib';
import { Section } from '@dragonfish/models/sections';

export namespace AQNamespace {
    export class GetQueue {
        static readonly type = '[Approval Queue] Get Queue';
        constructor(public pageNum: number) {}
    }

    export class GetQueueForMod {
        static readonly type = '[Approval Queue] Get Queue For Mod';
        constructor(public pageNum: number) {}
    }

    export class ClaimWork {
        static readonly type = '[Approval Queue] Claim Work';
        constructor(public doc: ApprovalQueue) {}
    }

    export class SelectWork {
        static readonly type = '[Approval Queue] Select Work';
        constructor(public doc: ApprovalQueue | null) {}
    }

    export class FetchSection {
        static readonly type = '[Approval Queue] Fetch Section';
        constructor(public sectionId: string) {}
    }

    export class ApproveWork {
        static readonly type = '[Approval Queue] Approve Work';
        constructor(public decision: Decision) {}
    }

    export class RejectWork {
        static readonly type = '[Approval Queue] Reject Work';
        constructor(public decision: Decision) {}
    }

    export class ViewContent {
        static readonly type = '[Approval Queue] View Content';
        constructor(public contentId: string, public kind: ContentKind, public userId: string) {}
    }
}
