import { TagKind } from './tag-kind.enum';

export interface TagsModel {
    readonly _id: string;
    name: string;
    desc?: string;
    parent?: string | TagsModel;
    taggedWorks?: number;
    readonly kind: TagKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface TagsTree extends TagsModel {
    children?: TagsTree[];
}
