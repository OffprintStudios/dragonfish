import { ContentModel } from '@dragonfish/shared/models/content';
import { RatingsModel } from '@dragonfish/shared/models/ratings';

export interface WorkPageState {
    content: ContentModel;
    ratings: RatingsModel;
    wordCount: number;
}

export function createInitialState(): WorkPageState {
    return {
        content: null,
        ratings: null,
        wordCount: 0,
    };
}
