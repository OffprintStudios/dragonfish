import { Module } from '@nestjs/common';
import * as Schemas from './schemas';
import * as Stores from './stores';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Content',
                useFactory: Schemas.setupContentCollection,
                discriminators: [
                    { name: 'BlogContent', schema: Schemas.BlogsContentSchema },
                    { name: 'NewsContent', schema: Schemas.NewsContentSchema },
                    { name: 'PoetryContent', schema: Schemas.PoetryContentSchema },
                    { name: 'ProseContent', schema: Schemas.ProseContentSchema },
                ]
            },
            {
                name: 'Ratings',
                useFactory: Schemas.setupRatingsCollection,
            },
            {
                name: 'ReadingHistory',
                useFactory: Schemas.setupReadingHistoryCollection,
            }
        ])
    ],
    providers: [
        Stores.ContentStore,
        Stores.RatingsStore,
        Stores.ReadingHistoryStore,
        Stores.BrowseStore,
    ],
    exports: [
        Stores.ContentStore,
        Stores.RatingsStore,
        Stores.ReadingHistoryStore,
        Stores.BrowseStore,
    ]
})
export class ContentModule {}
