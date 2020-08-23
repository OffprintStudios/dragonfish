import { Document } from 'mongoose';

import { Work } from '@pulp-fiction/models/works';

export interface WorkDocument extends Work, Document {
    readonly _id: string;       
}
