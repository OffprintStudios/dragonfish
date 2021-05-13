import { ContentModel, SectionInfo } from '@dragonfish/shared/models/content';
import { Section } from '@dragonfish/shared/models/sections';
import { RatingsModel } from '@dragonfish/shared/models/ratings';

/**
 * Component state for Content Views
 */
export interface ContentViewState {
    // The currently viewed content
    currContent: ContentModel | null;

    // All this content's sections (if applicable)
    allSections: SectionInfo[] | null;

    // The currently selected section (if applicable)
    currSection: Section | null;

    // The likes for this content
    likes: string[];

    // The dislikes for this content
    dislikes: string[];
}

export function createInitialState(): ContentViewState {
    return {
        currContent: null,
        allSections: null,
        currSection: null,
        likes: [],
        dislikes: [],
    };
}
