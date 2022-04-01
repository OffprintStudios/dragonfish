import type { TagsModel } from "$lib/models/content/works";

export function formatTagName(tag: TagsModel): string {
    if (tag.parent) {
        return (tag.parent as TagsModel).name + " — " + tag.name;
    }
    else {
        return tag.name;
    }
}
