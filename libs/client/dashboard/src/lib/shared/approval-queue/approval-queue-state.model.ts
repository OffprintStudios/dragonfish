import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { SectionInfo } from '@dragonfish/shared/models/content';
import { Section } from '@dragonfish/shared/models/sections';
import { PaginateResult } from '@dragonfish/shared/models/util';

export interface ApprovalQueueStateModel {
    currPageDocs: PaginateResult<ApprovalQueue> | null;
    claimedDocs: ApprovalQueue[];
    selectedDoc: ApprovalQueue | null;
    selectedDocSections: SectionInfo[] | null;
    selectedDocSection: Section | null;
}
