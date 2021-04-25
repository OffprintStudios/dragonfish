import { ContentFilter } from '@dragonfish/shared/models/content';
import { ThemePref } from '@dragonfish/shared/models/users';

export interface GlobalStateModel {
    filter: ContentFilter;
    theme: ThemePref;
}
