import { ContentModel } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';

export interface ContentStateModel {
    currContent: ContentModel | null;
    currHistDoc: ReadingHistory | null;
}