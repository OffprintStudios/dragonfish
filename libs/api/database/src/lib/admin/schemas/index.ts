import { Connection } from 'mongoose';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import * as MongooseSequence from 'mongoose-sequence';
import { CaseFileSchema } from './case-files/case-file.schema';

//#region ---EXPORTS---

export { CaseFileSchema, CaseFileDocument } from './case-files/case-file.schema';
export { UserCaseFileSchema, UserCaseFileDocument } from './case-files/user-case-file.schema';
export { CommentCaseFileSchema, CommentCaseFileDocument } from './case-files/comment-case-file.schema';
export { ContentCaseFileSchema, ContentCaseFileDocument } from './case-files/content-case-file.schema';

//#endregion

//#region ---SCHEMA FACTORIES---

export async function setupCaseFileCollection(connection: Connection) {
    const schema = CaseFileSchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    schema.plugin(MongoosePaginate);
    schema.plugin(MongooseSequence(connection), { inc_field: '_id' });
    return schema;
}

//#endregion
