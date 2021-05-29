import { ContentController } from './content.controller';
import { BrowseController } from './browse.controller';
import { HistoryController } from './history.controller';
import { MessagesController } from './messages.controller';
import { CommentsController } from './comments.controller';
import { CollectionsController } from './collections.controller';
import { SectionsController } from './sections.controller';
import { NewsController } from './news.controller';
import { RatingsController } from './ratings.controller';
import { TagsController } from './tags.controller';

export const ContentRoutes = [
    ContentController,
    BrowseController,
    HistoryController,
    MessagesController,
    CommentsController,
    CollectionsController,
    SectionsController,
    NewsController,
    RatingsController,
    TagsController,
];
