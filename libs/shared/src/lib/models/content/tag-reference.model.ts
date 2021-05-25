import { TagsModel } from '@dragonfish/shared/models/content/tags.model';

export interface TagReference {
    parentId: string | TagsModel;
    childId: string | null;
}
