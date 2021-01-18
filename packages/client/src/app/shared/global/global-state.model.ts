import { Themes } from '../../models/site';
import { ContentFilter } from '@pulp-fiction/models/content';

export interface GlobalStateModel {
    theme: Themes.Preference,
    filter: ContentFilter
}