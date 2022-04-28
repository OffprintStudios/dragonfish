import sanitizeHtml from 'sanitize-html';
import paginate from 'mongoose-paginate-v2';
import { sanitizeOptions } from '$shared/util';
import { MessageThreadsDocument, MessageThreadsSchema } from './message-threads.schema';
import { MessagesDocument, MessagesSchema } from './messages.schema';

//#region ---EXPORTS---

export { MessageThreadsDocument, MessageThreadsSchema } from './message-threads.schema';
export { MessagesDocument, MessagesSchema } from './messages.schema';

//#endregion

//#region ---SCHEMA FACTORIES---

export async function setupMessageThreadsCollection() {
    const schema = MessageThreadsSchema;

    schema.pre<MessageThreadsDocument>('save', async function (next) {
        this.set('name', sanitizeHtml(this.name, sanitizeOptions));
        return next();
    });

    schema.plugin(paginate);
    return schema;
}

export async function setupMessagesCollection() {
    const schema = MessagesSchema;

    schema.pre<MessagesDocument>('save', async function (next) {
        this.set('message', sanitizeHtml(this.message, sanitizeOptions));
        return next();
    });

    return schema;
}

//#endregion
