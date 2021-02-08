import { Section } from '@dragonfish/models/sections';

export interface SectionsStateModel {
    sections: Section[];
    currSection: Section;
}
