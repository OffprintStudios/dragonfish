import { Section } from '@dragonfish/shared/models/sections';

export interface SectionsStateModel {
    sections: Section[];
    currSection: Section;
}
