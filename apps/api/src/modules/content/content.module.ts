import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import * as Services from './services';
import * as Controllers from './controllers';
import { AccountsModule } from '$modules/accounts';
import { JwtModule } from '@nestjs/jwt';
import { getJwtSecretKey, JWT_EXPIRATION } from '$shared/util';
import { UtilitiesModule } from '$modules/utilities';

@Module({
    imports: [
        UtilitiesModule,
        AccountsModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'Content',
                useFactory: Schemas.setupContentCollection,
                discriminators: [
                    { name: 'BlogContent', schema: Schemas.BlogsContentSchema },
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
            },
            {
                name: 'ContentLibrary',
                useFactory: Schemas.setupContentLibraryCollection,
            },
            {
                name: 'Bookshelf',
                useFactory: Schemas.setupBookshelvesCollection,
            },
            {
                name: 'BookshelfItem',
                useFactory: Schemas.setupShelfItemsCollection,
            },
        ]),
        BullModule.registerQueue({
            name: 'content-library',
            limiter: {
                max: 1000,
                duration: 5000,
            },
        }),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    exports: [Stores.ContentStore, Stores.ContentGroupStore, Services.ContentService],
    controllers: [
        Controllers.ContentController,
        Controllers.ContentLibraryController,
        Controllers.BrowseController,
        Controllers.BookshelfController,
        Controllers.ReadingHistoryController,
        Controllers.RatingsController,
        Controllers.SectionsController,
        Controllers.TagsController,
        Controllers.SearchController,
        Controllers.NewsController,
    ],
    providers: [
        Stores.ContentStore,
        Stores.ContentGroupStore,
        Stores.BlogsStore,
        Stores.ProseStore,
        Stores.PoetryStore,
        Stores.RatingsStore,
        Stores.ReadingHistoryStore,
        Stores.TagsStore,
        Stores.SectionsStore,
        Stores.ContentLibraryStore,
        Stores.BookshelfStore,
        Services.ContentService,
        Services.SectionsService,
        Services.RatingsService,
        Services.ReadingHistoryService,
        Services.TagsService,
        Services.ContentLibraryService,
        Services.ContentLibraryConsumer,
        Services.SearchService,
    ],
})
export class ContentModule {}
