import { ContentModel, SectionInfo } from '@dragonfish/shared/models/content';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { Section } from '@dragonfish/shared/models/sections';
import { PaginateResult } from '@dragonfish/shared/models/util';

export interface ContentStateModel {
    currPageContent: PaginateResult<ContentModel> | null;
    currContent: ContentModel | null;
    currHistDoc: ReadingHistory | null;
    currSections: SectionInfo[] | null;
    currSection: Section | null;
    likes: number;
    dislikes: number;
}
