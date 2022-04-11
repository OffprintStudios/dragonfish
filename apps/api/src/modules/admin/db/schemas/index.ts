import { ApprovalQueueSchema } from './approval-queue';
import paginate from 'mongoose-paginate-v2';

//#region ---EXPORTS---

export { ApprovalQueueDocument, ApprovalQueueSchema } from './approval-queue';

//#endregion

//#region ---SCHEMA FACTORIES---

export async function setupApprovalQueueCollection() {
    const schema = ApprovalQueueSchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    schema.plugin(paginate);

    return schema;
}

//#endregion
