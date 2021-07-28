import { Module } from '@nestjs/common';
import * as Schemas from './schemas';
import * as Stores from './stores';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../notifications';
import { UsersModule } from '../users';
import { ApprovalQueueModule } from '../approval-queue';

@Module({
    imports: [
        UsersModule,
        NotificationsModule,
        ApprovalQueueModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'Content',
                useFactory: Schemas.setupContentCollection,
                discriminators: [
                    { name: 'BlogContent', schema: Schemas.BlogsContentSchema },
                    { name: 'NewsContent', schema: Schemas.NewsContentSchema },
                    { name: 'PoetryContent', schema: Schemas.PoetryContentSchema },
                    { name: 'ProseContent', schema: Schemas.ProseContentSchema },
                ],
            },
            {
                name: 'Ratings',
                useFactory: Schemas.setupRatingsCollection,
            },
            {
                name: 'ReadingHistory',
                useFactory: Schemas.setupReadingHistoryCollection,
            },
            {
                name: 'Sections',
                useFactory: Schemas.setupSectionsCollection,
            },
            {
                name: 'Tags',
                useFactory: Schemas.setupTagsCollection,
            }
        ]),
    ],
    providers: [
        Stores.ContentStore,
        Stores.RatingsStore,
        Stores.ReadingHistoryStore,
        Stores.BrowseStore,
        Stores.SectionsStore,
        Stores.BlogsStore,
        Stores.NewsStore,
        Stores.PoetryStore,
        Stores.ProseStore,
        Stores.TagsStore,
    ],
    exports: [
        Stores.ContentStore,
        Stores.RatingsStore,
        Stores.ReadingHistoryStore,
        Stores.BrowseStore,
        Stores.SectionsStore,
        Stores.BlogsStore,
        Stores.NewsStore,
        Stores.PoetryStore,
        Stores.ProseStore,
        Stores.TagsStore,
    ],
})
export class ContentModule {}
