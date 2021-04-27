import { Document } from 'mongoose';

import { AuditSession } from '@dragonfish/shared/models/users';

export interface AuditSessionDocument extends AuditSession, Document {
    readonly _id: string;
}
