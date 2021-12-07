import { CommentDocument, CommentSchema } from './comment.schema';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { Schema } from 'mongoose';
import * as sanitize from 'sanitize-html';
import { sanitizeOptions } from '@dragonfish/shared/models/util';

//#region ---EXPORTS---

export { CommentDocument, CommentSchema } from './comment.schema';
export { CommentHistoryDocument, CommentHistorySchema } from './comment-history.scema';
export { ContentCommentDocument, ContentCommentSchema } from './content-comment.schema';

//#endregion

//#region ---SCHEMA FACTORIES---

/**
 * Sets up the comment collection.
 * @returns
 */
export async function setupCommentCollection() {
    const schema = CommentSchema;

    schema.pre<CommentDocument>('save', async function (next) {
        this.set('body', sanitize(this.body, sanitizeOptions));
        return next();
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    schema.plugin(MongoosePaginate);

    return schema;
}

//#endregion
