export interface FandomTagModel {
    readonly _id: string;
    name: string;
    desc: string;
    parent: string;
    children: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}