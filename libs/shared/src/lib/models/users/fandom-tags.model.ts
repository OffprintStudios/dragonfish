import { SimpleTag } from "./simple-tag.model";

export interface FandomTags {
    _id: string;
    name: string;
    desc: string;
    parent: SimpleTag;
    children: [SimpleTag];
}