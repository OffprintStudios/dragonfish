import { Document } from 'mongoose';

export interface AuditSession extends Document {
    readonly _id: string;
    readonly expires: Date,
    readonly createdAt: Date,
}