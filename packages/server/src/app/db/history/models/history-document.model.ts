import { Document } from 'mongoose';

import { History } from '@pulp-fiction/models/history';

export interface HistoryDocument extends History, Document {
    readonly _id: string;
}

