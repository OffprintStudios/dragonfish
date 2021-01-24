import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { SectionInfo } from '@pulp-fiction/models/content';
import { Section } from '@pulp-fiction/models/sections';
import { PaginateResult } from '@pulp-fiction/models/util';

export interface ApprovalQueueStateModel {
    currPageDocs: PaginateResult<ApprovalQueue> | null;
    claimedDocs: ApprovalQueue[];
    selectedDoc: ApprovalQueue | null;
    selectedDocSections: SectionInfo[] | null;
    selectedDocSection: Section | null;
}