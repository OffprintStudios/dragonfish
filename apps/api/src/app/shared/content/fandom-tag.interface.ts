import { CreateFandomTag, FandomTagModel } from "@dragonfish/shared/models/content";

export interface IFandomTag {
    createFandomTag(fandomTagInfo: CreateFandomTag): Promise<FandomTagModel>;
}