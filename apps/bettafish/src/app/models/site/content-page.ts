import {
    BlogsContentModel,
    ContentModel,
    NewsContentModel,
    PoetryContent,
    ProseContent,
} from '@dragonfish/shared/models/content';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';

export interface ContentPage {
    readonly content: ContentModel | BlogsContentModel | NewsContentModel | ProseContent | PoetryContent;
    readonly history: ReadingHistory;
}
