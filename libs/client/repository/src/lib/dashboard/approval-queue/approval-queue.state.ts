import { PaginateResult } from '@dragonfish/shared/models/util';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { SectionInfo } from '@dragonfish/shared/models/content';
import { Section } from '@dragonfish/shared/models/sections';

export interface ApprovalQueueState {
    currPageDocs: PaginateResult<ApprovalQueue> | null;
    claimedDocs: ApprovalQueue[];
    selectedDoc: ApprovalQueue | null;
    selectedDocSections: SectionInfo[] | null;
    selectedDocSection: Section | null;
}

export function createInitialState(): ApprovalQueueState {
    return {
        currPageDocs: null,
        claimedDocs: [],
        selectedDoc: null,
        selectedDocSection: null,
        selectedDocSections: null,
    };
}
