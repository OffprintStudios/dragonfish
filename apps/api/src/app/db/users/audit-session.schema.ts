import { Schema } from 'mongoose';

import { AuditSessionDocument } from './models';

export const AuditSessionSchema = new Schema<AuditSessionDocument>({
    _id: { type: String, required: [true, `You must provide a sessionId.`] },
    expires: { type: Date, required: [true, `You must provide an expiration date.`] },
    createdAt: { type: Date, default: Date.now() },
});
