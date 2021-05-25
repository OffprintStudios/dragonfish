import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagsDocument } from '../schemas';
import { TagsForm } from '@dragonfish/shared/models/content';
import * as sanitize from 'sanitize-html';
import { isNullOrUndefined } from '@dragonfish/shared/functions';

@Injectable()
export class TagsStore {
    constructor(
        @InjectModel('Tags') private readonly tags: Model<TagsDocument>,
    ) {}

    /**
     * Creates a new parent tag.
     * @param form
     */
    async createParent(form: TagsForm): Promise<TagsDocument> {
        const newTag = new this.tags({
            name: sanitize(form.name),
            desc: sanitize(form.desc),
        });

        return newTag.save();
    }

    /**
     * Adds a new child tag to a parent.
     * @param parentId
     * @param childForm
     */
    async addChild(parentId: string, childForm: TagsForm): Promise<TagsDocument> {
        const parent = await this.tags.findById(parentId);

        if (isNullOrUndefined(parent)) {
            throw new NotFoundException(`The tag you're trying to update does not exist.`);
        }

        // has to be cast to `any` because the mongoose overload of `push` for some reason doesn't have proper typings
        parent.children.push(<any> { name: sanitize(childForm.name), desc: sanitize(childForm.desc) });

        return parent.save();
    }

    /**
     * Updates a parent tag.
     * @param parentId
     * @param form
     */
    async updateParent(parentId: string, form: TagsForm): Promise<TagsDocument> {
        const parent = await this.tags.findById(parentId);

        if (isNullOrUndefined(parent)) {
            throw new NotFoundException(`The tag you're trying to update does not exist.`);
        }

        parent.name = sanitize(form.name);
        parent.desc = sanitize(form.desc);

        return parent.save();
    }

    /**
     * Updates a child tag, belonging to the specified parent.
     * @param parentId
     * @param childId
     * @param form
     */
    async updateChild(parentId: string, childId: string, form: TagsForm) {
        const parent = await this.tags.findById(parentId);

        if (isNullOrUndefined(parent)) {
            throw new NotFoundException(`The tag you're trying to update does not exist.`);
        }

        const childIndex = parent.children.findIndex(child => { return child._id === childId; });

        if (childIndex === -1) {
            throw new NotFoundException(`The tag you're trying to update does not exist.`);
        }

        parent.children[childIndex].name = sanitize(form.name);
        parent.children[childIndex].desc = sanitize(form.desc);

        return parent.save();
    }

    /**
     * Deletes a parent tag.
     * @param parentId
     */
    async deleteParent(parentId: string) {
        await this.tags.findByIdAndDelete(parentId);
    }

    /**
     * Removes a child from a parent.
     * @param parentId
     * @param childId
     */
    async removeChild(parentId: string, childId: string) {
        const parent = await this.tags.findById(parentId);

        if (isNullOrUndefined(parent)) {
            throw new NotFoundException(`The tag you're trying to update does not exist.`);
        }

        const childIndex = parent.children.findIndex(child => { return child._id === childId; });

        if (childIndex === -1) {
            throw new NotFoundException(`The tag you're trying to update does not exist.`);
        }

        parent.children[childIndex].remove();
        return parent.save();
    }
}
