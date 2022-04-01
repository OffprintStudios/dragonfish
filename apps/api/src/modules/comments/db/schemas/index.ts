import { CommentDocument, CommentSchema } from './comment.schema';
import sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '$shared/util';

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

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-paginate-v2'));

    return schema;
}

//#endregion
