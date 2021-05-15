import { ContentModel, SectionInfo } from '@dragonfish/shared/models/content';
import { Section } from '@dragonfish/shared/models/sections';
import { RatingsModel } from '@dragonfish/shared/models/ratings';
import { RatingOption } from '@dragonfish/shared/models/reading-history';

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

    // Current ratings doc
    ratingsDoc: RatingsModel | null;

    // Currently selected rating option
    currRating: RatingOption;

    // The likes for this content
    likes: number;

    // The dislikes for this content
    dislikes: number;
}

export function createInitialState(): ContentViewState {
    return {
        currContent: null,
        allSections: null,
        currSection: null,
        ratingsDoc: null,
        currRating: RatingOption.NoVote,
        likes: 0,
        dislikes: 0,
    };
}
