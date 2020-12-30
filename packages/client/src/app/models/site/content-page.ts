import { BlogsContentModel, ContentModel, NewsContentModel, PoetryContent, ProseContent } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';

export interface ContentPage {
    readonly content: ContentModel | BlogsContentModel | NewsContentModel | ProseContent | PoetryContent;
    readonly history: ReadingHistory;
}