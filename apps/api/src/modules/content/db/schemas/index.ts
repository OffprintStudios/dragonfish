import sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '$shared/util';
import { ContentDocument, ContentSchema } from './content.schema';
import { RatingsSchema } from './ratings.schema';
import { ReadingHistorySchema } from './reading-history.schema';
import { SectionsDocument, SectionsSchema } from './sections.schema';
import { TagsSchema } from './tags.schema';
import { ContentLibrarySchema } from './content-library.schema';
import { BookshelfDocument, BookshelfSchema } from './bookshelf.schema';
import { ShelfItemSchema } from './shelf-item.schema';
import { countWords, stripTags } from 'voca';

//#region ---EXPORTS---

export { ContentDocument, ContentSchema } from './content.schema';
export { BlogsContentDocument, BlogsContentSchema } from './blogs-content.schema';
export { PoetryContentDocument, PoetryContentSchema } from './poetry-content.schema';
export { ProseContentDocument, ProseContentSchema } from './prose-content.schema';
export { RatingsDocument, RatingsSchema } from './ratings.schema';
export { ReadingHistoryDocument, ReadingHistorySchema } from './reading-history.schema';
export { SectionsDocument, SectionsSchema } from './sections.schema';
export { TagsDocument, TagsSchema } from './tags.schema';
export { ContentLibraryDocument, ContentLibrarySchema } from './content-library.schema';
export { BookshelfDocument, BookshelfSchema } from './bookshelf.schema';
export { ShelfItemDocument, ShelfItemSchema } from './shelf-item.schema';

//#endregion

//#region ---SCHEMA FACTORIES---

/**
 * Sets up the content collection and its associated middleware.
 */
export async function setupContentCollection() {
    const schema = ContentSchema;

    // making a text index on the title field for search
    schema.index({ title: 'text' });

    schema.pre<ContentDocument>('save', async function (next) {
        this.set('title', sanitizeHtml(this.title, sanitizeOptions));
        this.set('body', sanitizeHtml(this.body, sanitizeOptions));

        // this will only trigger if any creation or editing functions has modified the `desc` field,
        // otherwise we'll leave it alone
        if (this.isModified('desc')) {
            this.set('desc', sanitizeHtml(this.desc, sanitizeOptions));
        }

        return next();
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-paginate-v2'));

    return schema;
}

/**
 * Sets up the sections collection and.
 */
export async function setupSectionsCollection() {
    const schema = SectionsSchema;
    schema.pre<SectionsDocument>('save', async function (next) {
        this.set('title', sanitizeHtml(this.title, sanitizeOptions));
        this.set('body', sanitizeHtml(this.body, sanitizeOptions));
        if (this.authorsNote) {
            this.set('authorsNote', sanitizeHtml(this.authorsNote, sanitizeOptions));
        }
        if (this.authorsNotePos) {
            this.set('authorsNotePos', this.authorsNotePos);
        }
        this.set('published', this.published);

        const wordCount = countWords(stripTags(sanitizeHtml(this.body, sanitizeOptions)));
        this.set('stats.words', Number(wordCount));

        return next();
    });
    return schema;
}

/**
 * Sets up the ratings collection.
 */
export async function setupRatingsCollection() {
    // we just return the schema because there's no other parsing we need to do here.
    // this function is required because we're using an async setup to build the collections.
    return RatingsSchema;
}

/**
 * Sets up the reading history collection.
 */
export async function setupReadingHistoryCollection() {
    const schema = ReadingHistorySchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-paginate-v2'));

    return schema;
}

/**
 * Sets up the tags collection.
 */
export async function setupTagsCollection() {
    const schema = TagsSchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));

    schema.index({ parent: 1, name: 1 });

    return schema;
}

/**
 * Sets up the content library collection.
 */
export async function setupContentLibraryCollection() {
    const schema = ContentLibrarySchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-paginate-v2'));

    return schema;
}

/**
 * Sets up the bookshelves collection.
 */
export async function setupBookshelvesCollection() {
    const schema = BookshelfSchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-paginate-v2'));

    schema.pre<BookshelfDocument>('save', async function (next) {
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

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-paginate-v2'));

    return schema;
}

//#endregion
