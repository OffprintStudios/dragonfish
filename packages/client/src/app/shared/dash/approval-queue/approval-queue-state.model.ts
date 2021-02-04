import { ApprovalQueue } from '@dragonfish/models/approval-queue';
import { SectionInfo } from '@dragonfish/models/content';
import { Section } from '@dragonfish/models/sections';
import { PaginateResult } from '@dragonfish/models/util';

export interface ApprovalQueueStateModel {
    currPageDocs: PaginateResult<ApprovalQueue> | null;
    claimedDocs: ApprovalQueue[];
    selectedDoc: ApprovalQueue | null;
    selectedDocSections: SectionInfo[] | null;
    selectedDocSection: Section | null;
}