import { Tag } from '@dragonfish/shared/models/tags';

export interface TagsStateModel {
    tags: Tag[];
    loading: boolean;
    currTag: Tag;
}
