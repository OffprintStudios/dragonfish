import { Schema } from "mongoose";

import { AuditSession } from './models/audit-session.model';

export const AuditSessionSchema = new Schema<AuditSession>({
    _id: {type: String, required: [true, `You must provide a sessionId.`]},
    expires: {type: Date, required: [true, `You must provide an expiration date.`]},
    createdAt: {type: Date, default: Date.now()},
});