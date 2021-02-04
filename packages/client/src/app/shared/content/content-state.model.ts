import { ContentModel, SectionInfo } from '@dragonfish/models/content';
import { ReadingHistory } from '@dragonfish/models/reading-history';
import { Section } from '@dragonfish/models/sections';
import { PaginateResult } from '@dragonfish/models/util';

export interface ContentStateModel {
    currPageContent: PaginateResult<ContentModel> | null;
    currContent: ContentModel | null;
    currHistDoc: ReadingHistory | null;
    currSections: SectionInfo[] | null;
    currSection: Section | null;
    likes: number;
    dislikes: number;
}
