import { ContentLibrarySchema } from './content-library.schema';
import { BookshelfDocument, BookshelfSchema } from './bookshelf.schema';
import { ShelfItemSchema } from './shelf-item.schema';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { HookNextFunction } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '@dragonfish/shared/models/util';

//#region ---EXPORTS---

export { ContentLibraryDocument, ContentLibrarySchema } from './content-library.schema';
export { BookshelfDocument, BookshelfSchema } from './bookshelf.schema';
export { ShelfItemDocument, ShelfItemSchema } from './shelf-item.schema';

//#endregion

//#region ---SCHEMA FACTORIES---

/**
 * Sets up the content library collection.
 */
export async function setupContentLibraryCollection() {
    const schema = ContentLibrarySchema;

    schema.plugin(MongooseAutopopulate);
    schema.plugin(MongoosePaginate);

    return schema;
}

/**
 * Sets up the bookshelves collection.
 */
export async function setupBookshelvesCollection() {
    const schema = BookshelfSchema;

    schema.plugin(MongoosePaginate);
    schema.pre<BookshelfDocument>('save', async function (next: HookNextFunction) {
        this.set('name', sanitizeHtml(this.name, sanitizeOptions));
        if (this.isModified('desc')) {
            this.set('desc', sanitizeHtml(this.desc, sanitizeOptions));
        }
        return next();
    });

    return schema;
}

/**
 * Sets up the shelf items collection.
 */
export async function setupShelfItemsCollection() {
    const schema = ShelfItemSchema;

    schema.plugin(MongooseAutopopulate);
    schema.plugin(MongoosePaginate);

    return schema;
}

//#endregion
