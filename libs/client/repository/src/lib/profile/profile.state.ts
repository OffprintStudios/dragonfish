import { Pseudonym } from '@dragonfish/shared/models/accounts';
import { ContentModel } from '@dragonfish/shared/models/content';

export interface ProfileState {
    currProfile: Pseudonym;
    homeWorks: ContentModel[];
    homeBlogs: ContentModel[];
}

export function createInitialState(): ProfileState {
    return {
        currProfile: null,
        homeWorks: null,
        homeBlogs: null,
    };
}
