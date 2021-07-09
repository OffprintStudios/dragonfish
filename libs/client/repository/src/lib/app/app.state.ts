import { ContentFilter } from '@dragonfish/shared/models/content';
import { ThemePref } from '@dragonfish/shared/models/users';

export interface AppState {
    isOfAge: boolean,
    filter: ContentFilter;
    theme: ThemePref;
}

export function createInitialState(): AppState {
    return {
        isOfAge: false,
        filter: ContentFilter.Default,
        theme: ThemePref.Crimson,
    };
}
