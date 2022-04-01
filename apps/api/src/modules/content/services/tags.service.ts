import { Injectable, NotFoundException } from '@nestjs/common';
import { TagsStore } from '../db/stores';
import { TagKind, TagsModel, TagsForm, TagsTree } from '$shared/models/content/tags';
import { ContentService } from './content.service';

@Injectable()
export class TagsService {
    constructor(private readonly tagsStore: TagsStore, private readonly content: ContentService) {}

    async fetchTagsTrees(kind: TagKind): Promise<TagsTree[]> {
        return await this.tagsStore.fetchTagsTrees(kind);
    }

    async fetchDescendants(id: string): Promise<TagsTree> {
        return await this.tagsStore.fetchDescendants(id);
    }

    async createTag(kind: TagKind, form: TagsForm): Promise<TagsModel> {
        return await this.tagsStore.createTag(form, kind);
    }

    async updateTag(id: string, form: TagsForm): Promise<TagsModel> {
        return await this.tagsStore.updateTag(id, form);
    }

    async deleteTag(id: string): Promise<void> {
        // First, delete all references to this tag elsewhere in the database
        const tagToDelete = await this.tagsStore.findOne(id);
        if (!tagToDelete) {
            throw new NotFoundException(`No tag with the ID ${id} could be found.`);
        }

        await this.content.removeTagReferences(tagToDelete._id);

        // Clear parent for its children
        const tagTree = await this.tagsStore.fetchDescendants(id);
        for (const child of tagTree.children) {
            const form: TagsForm = {
                name: child.name,
                desc: child.desc,
                parent: null,
            };
            await this.tagsStore.updateTag(child._id, form);
        }

        // Then, delete the tag itself
        const deletedDocument = await this.tagsStore.deleteTag(id);
        return deletedDocument;
    }
}
