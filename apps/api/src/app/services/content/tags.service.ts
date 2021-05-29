import { Injectable } from "@nestjs/common";
import { TagsStore } from "@dragonfish/api/database/content/stores";
import { TagKind, TagsModel, TagsForm } from "@dragonfish/shared/models/content";
import { TagsTree } from "@dragonfish/shared/models/content/tags.model";
import { ITagsService } from "../../shared/content";

@Injectable()
export class TagsService implements ITagsService {
    constructor(
        private readonly tagsStore: TagsStore) { }

    async fetchTags(kind: TagKind): Promise<TagsModel[]> {
        return await this.tagsStore.fetchTags(kind);
    }

    async fetchDescendants(id: string): Promise<TagsTree> {
        return await this.tagsStore.fetchDescendants(id);
    }

    async createTag(kind: TagKind, form: TagsForm): Promise<TagsModel> {
        return await this.tagsStore.createTag(kind, form);
    }

    async updateTag(id: string, form: TagsForm): Promise<TagsModel> {
        return await this.tagsStore.updateTag(id, form);
    }

    async deleteTag(id: string): Promise<void> {
        // Delete from database
        const deletedDocument = this.tagsStore.deleteTag(id);

        // TODO: Remove from all content documents
        // This should proably be a background process

        return deletedDocument;
    }
}
