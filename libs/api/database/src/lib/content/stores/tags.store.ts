import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentDocument, TagsDocument } from '../schemas';
import { TagKind, TagsForm } from '@dragonfish/shared/models/content/tags';
import * as sanitize from 'sanitize-html';
import { TagsTree } from '@dragonfish/shared/models/content/tags/tags.model';
import { ContentKind, PubStatus } from '@dragonfish/shared/models/content';

@Injectable()
export class TagsStore {
    private readonly logger: Logger = new Logger(TagsStore.name);

    constructor(
        @InjectModel('Tags') private readonly tags: Model<TagsDocument>,
        @InjectModel('Content') private readonly content: Model<ContentDocument>,
    ) {}

    /**
     * Get all tags of the given `TagKind`, sorted into TagsTrees.
     * NOTE: Children are not sorted alphabetically.
     * @param kind The `TagKind` of the tags to look for.
     */
    async fetchTagsTrees(kind: TagKind): Promise<TagsTree[]> {
        // We force maxDepth to be 0 so that we only get the node's immediate children.
        // If we went further, Mongo would just give us a flat array, and we'd have to
        // put it together ourselves anyway.
        const results: TagsTree[] = await this.tags.aggregate<TagsTree>([
            { $match: { kind: kind, parent: null } }
        ])
        .sort({ name: 1 })
        .graphLookup({
            from: 'tags',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parent',
            as: 'children', // Careful: this string should match the name of the property in `TagsTree`.
            maxDepth: 0,
        })
        .exec();
        if (results.length === 0) {
            return null;
        }

        return results;
    }

    /**
     * Returns a single tag with the given ID, or null if not found.
     * @param id The ID of the tag to find.
     * @returns The tag with the ID.
     */
    async findOne(id: string): Promise<TagsDocument> {
        return this.tags.findById(id);
    }

    /**
     * Returns a single tag with the given name, or null if not found.
     * @param name The name of the tag to find.
     * @returns The tag with the name.
     */
    async findTagByName(name: string): Promise<TagsDocument> {
        return this.tags.findOne({ name: name })
    }

    /**
     * Returns a single parent tag (with no parents of its own) with the given name, or null if not found.
     * @param name The name of the tag to find.
     * @returns The tag with the name.
     */
    async findParentTagByName(name: string): Promise<TagsDocument> {
        return this.tags.findOne({ name: name, parent: null})
    }

    /**
     * Returns a single child tag with the given name and parent, or null if not found
     * @param name The name of the tag to find
     * @param parentId The ID of the parent tag
     * @returns The tag with the name.
     */
    async findChildTagByNameAndParent(name: string, parentId: string): Promise<TagsDocument> {
        return this.tags.findOne({ name: name, parent: parentId })
    }

    /**
     * Returns the given tag and all its descendants.
     * @param tagId
     */
    async fetchDescendants(tagId: string): Promise<TagsTree> {
        const parentTag = await this.tags.findById(tagId);
        if (!parentTag) {
            throw new NotFoundException("No tag with that ID found.");
        }

        const root: TagsTree = {
            ...parentTag.toObject(),
            children: []
        };
        const tree = await this.buildDescendantTree(root);

        return tree;
    }

    private async buildDescendantTree(tagNode: TagsTree): Promise<TagsTree> {
        const currentRoot = await this.populateImmediateChildren(tagNode._id);
        if (!currentRoot.children || currentRoot.children.length === 0) {
            // BASE CASE: If we can't find any children for this node, it is a leaf. Return it.
            return tagNode;
        }

        // Otherwise, iterate through each child node, find _its_ children,
        // and add them to the node's `children` property.
        for (const child of currentRoot.children) {
            child.children = (await this.buildDescendantTree(child))?.children;
        }

        return currentRoot;
    }

    /**
     * Returns the Tag, with an extra `children` property array that contains all of this
     * tag's immediate children.
     * @param id The ID of the tag to populate.
     */
    private async populateImmediateChildren(id: string): Promise<TagsTree> {
        // We force maxDepth to be 0 so that we only get the node's immediate children.
        // If we went further, Mongo would just give us a flat array, and we'd have to
        // put it together ourselves anyway.
        const results: TagsTree[] = await this.tags.aggregate<TagsTree>([
            { $match: { _id: id } }
        ])
        .graphLookup({
            from: 'tags',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parent',
            as: 'children', // Careful: this string should match the name of the property in `TagsTree`.
            maxDepth: 0,
        }).exec();
        if (results.length === 0) {
            return null;
        }

        // Because we specify maxDepth of 0, and look up a single ID, we don't
        // expect (or care about) anything beyond the first result.
        return results[0];
    }

    /**
     * Given a tagId, constructs an array of that tagId and the IDs of that tag's children
     * @param tagId ID of tag that searching for children for
     * @returns string[] of the given tagId and the IDs of that tag's children (just tagId if it has no children)
     */
     private async getAllTagIds(tagId: string): Promise<string[]> {
        const childTags = await this.tags.find({ parent: tagId });
        if (childTags) {
            const childTagIds = childTags.map((tag) => tag._id);
            childTagIds.push(tagId);
            return childTagIds;
        }
        return [tagId];
    }

    /**
     * Creates a new tag.
     * @param form
     * @param tagKind
     */
    async createTag(form: TagsForm, tagKind: TagKind): Promise<TagsDocument> {
        if (form.parent) {
            // Ensure the parent exists and its kind matches
            const parentTag = await this.tags.findById(form.parent);
            if (!parentTag) {
                throw new NotFoundException("Could not find any parent tag with that ID.");
            }
            if (parentTag.kind !== tagKind) {
                throw new BadRequestException("The parent tag's kind must match the new tag's kind.");
            }
        }

        if (!form.name || form.name.length < 1) {
            throw new BadRequestException("You must provide a name.");
        }

        const newTag = new this.tags({
            name: sanitize(form.name),
            desc: sanitize(form.desc),
            kind: tagKind,
            parent: form.parent,
        });

        // If child tag, check that name not already in use by its siblings
        if (form.parent) {
            const tagWithSameName = await this.findChildTagByNameAndParent(newTag.name, form.parent);
            if (tagWithSameName) {
                throw new BadRequestException("There is already a child tag of this parent with this name.");
            }
        }
        // If parent tag, check that name not already in use by another parent tag
        // Don't check for duplicates with children
        else {
            const tagWithSameName = await this.findParentTagByName(newTag.name)
            if (tagWithSameName) {
                throw new BadRequestException("There is already a parent tag with this name.");
            }
        }

        return newTag.save();
    }

    /**
     * Updates a tag.
     * @param tagId The ID of the tag to update.
     * @param form The details of the update operation.
     */
    async updateTag(tagId: string, form: TagsForm): Promise<TagsDocument> {
        const tag = await this.tags.findById(tagId);
        if (!tag) {
            throw new NotFoundException(`The tag you're trying to update does not exist.`);
        }

        // If we're changing this tag's parent, make sure we aren't accidentally parenting it to
        // itself; and if it has children, then for now, we shouldn't allow the parent to be changed
        if (form.parent) {
            if (form.parent === tag._id) {
                throw new BadRequestException("Cannot change this tag's parent to itself.");
            }
            const tagWithChildren = await this.populateImmediateChildren(tag._id);
            if (tagWithChildren.children && tagWithChildren.children.length > 0) {
                throw new BadRequestException("Don't assign a parent to a tag with children.");
            }
        }

        tag.name = sanitize(form.name);
        tag.desc = sanitize(form.desc);

        if (form.parent) {
            tag.parent = form.parent;
        }

        // Allows to set parent as null
        if (form.parent === null) {
            tag.parent = null;
        }

        // If child tag, check if changed name to that of one of its siblings
        if (form.parent) {
            const tagWithSameName = await this.findChildTagByNameAndParent(tag.name, form.parent);
            if (tagWithSameName && tagId !== tagWithSameName._id) {
                throw new BadRequestException("There is already another child tag of this parent with this name.");
            }
        }
        // If parent tag, check if changed name to that of another parent tag
        // Don't check for duplicates with children
        else {
            const tagWithSameName = await this.findParentTagByName(tag.name);
            if (tagWithSameName && tagId !== tagWithSameName._id) {
                throw new BadRequestException("There is already another parent tag with this name.");
            }
        }

        const numTaggedWorks = await this.getNumberOfTaggedWorks(tagId);
        tag.taggedWorks = numTaggedWorks;

        return tag.save();
    }

    /**
     * Checks how many published works are tagged with this tag, and updates the taggedWorks value to that
     * Includes children
     * @param tagId The ID of the tag to update.
     */
    async updateTaggedWorks(tagId: string): Promise<void> {
        const numTaggedWorks = await this.getNumberOfTaggedWorks(tagId);
        const tagDocument = await this.tags.findById(tagId);
        tagDocument.taggedWorks = numTaggedWorks;

        tagDocument.save();

        // Updates parent if available
        const parent = tagDocument.parent;
        if (parent) {
            let parentId: string;
            if (typeof parent === 'object') {
                parentId = parent._id;
            } else {
                parentId = parent;
            }
            const parentNumTaggedWorks = await this.getNumberOfTaggedWorks(parentId);
            const parentTagDocument = await this.tags.findById(parentId);
            parentTagDocument.taggedWorks = parentNumTaggedWorks;

            parentTagDocument.save();
        }
    }

    /**
     * Checks how many published works are tagged with this tag.
     * @param tagId The ID of the tag that checking
     * @returns The number of published works tagged with this tag. Includes children.
     */
    private async getNumberOfTaggedWorks(tagId: string): Promise<number> {
        const tagArray = await this.getAllTagIds(tagId);
        const query = {
            'audit.published': PubStatus.Published,
            'audit.isDeleted': false,
            kind: { $in: [ContentKind.ProseContent, ContentKind.PoetryContent] },
            tags: { $in: tagArray },
        };

        // Find number of works with those tags
        return this.content.count(query);
    }

    /**
     * Deletes a tag.
     * @param parentId
     */
    async deleteTag(parentId: string): Promise<void> {
        await this.tags.findByIdAndDelete(parentId);
    }
}
