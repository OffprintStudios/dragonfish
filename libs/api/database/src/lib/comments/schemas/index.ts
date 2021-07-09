import { CommentDocument, CommentSchema } from './comment.schema';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { HookNextFunction, Schema } from 'mongoose';
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
export async function setupCommentCollection(): Promise<Schema<CommentDocument>> {
    const schema = CommentSchema;
    
    schema.pre<CommentDocument>('save', async function (next: HookNextFunction) {
        this.set('body', sanitize(this.body, sanitizeOptions));
        return next();
    });

    schema.plugin(MongooseAutopopulate);
    schema.plugin(MongoosePaginate);

    return schema;
}

//#endregion
