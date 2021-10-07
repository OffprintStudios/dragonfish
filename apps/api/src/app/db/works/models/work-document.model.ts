import { Document } from 'mongoose';

import { Work } from '@dragonfish/shared/models/works';

/** 
 * @deprecated No longer used
 */
export interface WorkDocument extends Work, Document {
    readonly _id: string;
}
