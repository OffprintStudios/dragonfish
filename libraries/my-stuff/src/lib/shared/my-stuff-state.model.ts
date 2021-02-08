import { ContentModel } from '@dragonfish/models/content';

export interface MyStuffStateModel {
    myStuff: ContentModel[];
    currContent: ContentModel;
    currContentWordCount: number;
}
