import { ContentModel } from '@pulp-fiction/models/content';

export interface ContentItem extends ContentModel {
    selected: boolean;
}