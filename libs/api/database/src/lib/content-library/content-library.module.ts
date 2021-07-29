import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './schemas';
import * as Stores from './stores';

@Module({
    imports: [
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
    ],
    providers: [Stores.ContentLibraryStore, Stores.BookshelfStore],
    exports: [Stores.ContentLibraryStore, Stores.BookshelfStore],
})
export class ContentLibraryModule {}
