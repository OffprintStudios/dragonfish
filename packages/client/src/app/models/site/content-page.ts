import { ContentModel } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';

export interface ContentPage {
    readonly content: ContentModel;
    readonly history: ReadingHistory;
}