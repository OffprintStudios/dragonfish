import { TagsTree } from "@dragonfish/shared/models/content/tags/tags.model";

export class AlphabeticalTags {
    tags: TagsTree[] = [];
    constructor(public letter: string) {

    }
}