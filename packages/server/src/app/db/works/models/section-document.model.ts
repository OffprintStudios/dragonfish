import { Document } from 'mongoose';

import { Section } from '@pulp-fiction/models/works';

export interface SectionDocument extends Section, Document {
    readonly _id: string;    
}
