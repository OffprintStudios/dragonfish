import { Document } from 'mongoose';

import { Work } from '@dragonfish/models/works';

export interface WorkDocument extends Work, Document {
    readonly _id: string;       
}
