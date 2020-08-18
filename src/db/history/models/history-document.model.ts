import { Document } from 'mongoose';

import { History, HistoryItem } from 'shared/models/history';

export interface HistoryDocument extends History, Document {
    readonly _id: string;
}

export interface HistoryItemDocument extends HistoryItem, Document {
    readonly _id: string;
}
