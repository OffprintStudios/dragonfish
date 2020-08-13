import { Document } from 'mongoose';

import { History } from 'shared/models/history';

export interface HistoryDocument extends History, Document {
    readonly _id: string;
}
