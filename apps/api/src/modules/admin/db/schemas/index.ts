import { ApprovalQueueSchema } from './approval-queue';

//#region ---EXPORTS---

export { ApprovalQueueDocument, ApprovalQueueSchema } from './approval-queue';

//#endregion

//#region ---SCHEMA FACTORIES---

export async function setupApprovalQueueCollection() {
    const schema = ApprovalQueueSchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-paginate-v2'));

    return schema;
}

//#endregion
