import { Section } from "@pulp-fiction/models/sections";

export interface SectionsStateModel {
    sections: Section[];
    currSection: Section;
}