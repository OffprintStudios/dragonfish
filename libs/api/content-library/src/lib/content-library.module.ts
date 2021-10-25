import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import * as Stores from './db/stores';
import * as Schemas from './db/schemas';
import * as Services from './services';
import * as Controllers from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { getJwtSecretKey, JWT_EXPIRATION } from '@dragonfish/api/utilities/secrets';
import { AccountsModule } from '@dragonfish/api/database/accounts';
import { ContentModule } from '@dragonfish/api/database/content';

@Module({
    controllers: [Controllers.ContentLibraryController, Controllers.BookshelfController],
    providers: [Services.LibraryService, Services.LibraryConsumer, Stores.ContentLibraryStore, Stores.BookshelfStore],
    imports: [
        AccountsModule,
        ContentModule,
        MongooseModule.forFeatureAsync([
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
    exports: [Stores.ContentLibraryStore, Stores.BookshelfStore],
})
export class ContentLibraryModule {}

/* Misc Exports */
export * from './db/stores';
