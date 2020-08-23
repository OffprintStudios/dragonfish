import { Document } from 'mongoose';

import { AuditSession } from '@pulp-fiction/models/users';

export interface AuditSessionDocument extends AuditSession, Document {
    readonly _id: string;

}