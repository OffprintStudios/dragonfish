import { CommentDocument, CommentSchema } from './comment.schema';
import sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '$shared/util';
import paginate from 'mongoose-paginate-v2';

//#region ---EXPORTS---

export { CommentDocument, CommentSchema } from './comment.schema';
export { CommentHistoryDocument, CommentHistorySchema } from './comment-history.schema';
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
        this.set('body', sanitizeHtml(this.body, sanitizeOptions));
        return next();
    });
    schema.plugin(paginate);

    return schema;
}

//#endregion
