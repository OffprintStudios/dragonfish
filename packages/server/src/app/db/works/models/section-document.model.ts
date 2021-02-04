import { Document } from 'mongoose';

import { Section } from '@dragonfish/models/works';

export interface SectionDocument extends Section, Document {
    readonly _id: string;
}
