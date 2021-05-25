export interface TagsModel {
    readonly _id: string;
    name: string;
    desc: string;
    children: ChildTagsModel[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface ChildTagsModel {
    readonly _id: string;
    name: string;
    desc: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
