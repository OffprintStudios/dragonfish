import { Document } from 'mongoose';

import { Section } from 'shared/models/works';

export interface SectionDocument extends Section, Document {
    readonly _id: string;    
}
