import { ContentModel } from '@dragonfish/shared/models/content';
import { RatingsModel } from '@dragonfish/shared/models/ratings';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ContentLibrary } from '@dragonfish/shared/models/users/content-library';

export interface WorkPageState {
    content: ContentModel;
    ratings: RatingsModel;
    selectedRating: RatingOption | null;
    libraryDoc: ContentLibrary | null;
    likes: number;
    dislikes: number;
    wordCount: number;
}

export function createInitialState(): WorkPageState {
    return {
        content: null,
        ratings: null,
        selectedRating: RatingOption.NoVote,
        libraryDoc: null,
        likes: 0,
        dislikes: 0,
        wordCount: 0,
    };
}
