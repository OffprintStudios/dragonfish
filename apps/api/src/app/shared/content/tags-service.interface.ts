import { TagKind, TagsForm, TagsModel } from "@dragonfish/shared/models/content";
import { TagsTree } from "@dragonfish/shared/models/content/tags.model";

export interface ITagsService {
    fetchTags(kind: TagKind): Promise<TagsModel[]>;
    fetchDescendants(id: string): Promise<TagsTree>;
    createTag(kind: TagKind, form: TagsForm): Promise<TagsModel>;
    deleteTag(id: string): Promise<void>
    updateTag(id: string, form: TagsForm): Promise<TagsModel>;
}
