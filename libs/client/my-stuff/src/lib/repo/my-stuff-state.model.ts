import { ContentModel } from '@dragonfish/shared/models/content';

export interface MyStuffStateModel {
    myStuff: ContentModel[];
    currContent: ContentModel;
    currContentWordCount: number;
}
