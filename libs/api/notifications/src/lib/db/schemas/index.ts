import { NotificationSchema } from './notification.schema';

//#region ---EXPORTS---

export { NotificationDocument, NotificationSchema } from './notification.schema';

//#endregion

//#region ---SCHEMA FACTORIES---

export async function setupNotificationsCollection() {
    const schema = NotificationSchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-paginate-v2'));

    return schema;
}

//#endregion
