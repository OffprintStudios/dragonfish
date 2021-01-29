import { ContentModel } from "@pulp-fiction/models/content";

export interface MyStuffStateModel {
    myStuff: ContentModel[];
    currContent: ContentModel;
    currContentWordCount: number;
}