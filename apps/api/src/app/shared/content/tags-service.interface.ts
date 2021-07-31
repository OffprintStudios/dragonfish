import { TagKind, TagsForm, TagsModel } from "@dragonfish/shared/models/content";
import { TagsTree } from "@dragonfish/shared/models/content/tags.model";

export interface ITagsService {

    /**
     * Get all tags of the given `TagKind`, sorted into TagsTrees.
     * @param kind The `TagKind` of the tags to look for.
     */
     fetchTagsTrees(kind: TagKind): Promise<TagsTree[]>;

    /**
     * Get all children of the tag with the given ID.
     * Returns both the parent tag's information, and a `children` array,
     * which will either contain the child tags, or be empty.
     * @param id The tag whose children will be searched for.
     */
    fetchDescendants(id: string): Promise<TagsTree>;

    /**
     * Create a tag of the given kind, with the given information.
     * @param kind The `TagKind` to create.
     * @param form The input information used to create the tag.
     */
    createTag(kind: TagKind, form: TagsForm): Promise<TagsModel>;

    /**
     * Delete the tag with the given ID from the tags collection, and remove 
     * **all** references to it from **all** content.
     * @param id The ID of the tag to delete.
     */
    deleteTag(id: string): Promise<void>

    /**
     * Set the tag with the given ID's attributes to those contained in the given `TagsForm`.
     * @param id The ID of the tag to update.
     * @param form The new attributes to apply to the given tag.
     */
    updateTag(id: string, form: TagsForm): Promise<TagsModel>;
}
