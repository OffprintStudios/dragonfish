import { ContentModel } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';
import { Section } from '@pulp-fiction/models/sections';

export interface ContentStateModel {
    currContent: ContentModel | null;
    currHistDoc: ReadingHistory | null;
    currSections: Section[] | null;
}