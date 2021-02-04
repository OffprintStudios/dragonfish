import { BlogsContentModel, ContentModel, NewsContentModel, PoetryContent, ProseContent } from '@dragonfish/models/content';
import { ReadingHistory } from '@dragonfish/models/reading-history';

export interface ContentPage {
    readonly content: ContentModel | BlogsContentModel | NewsContentModel | ProseContent | PoetryContent;
    readonly history: ReadingHistory;
}