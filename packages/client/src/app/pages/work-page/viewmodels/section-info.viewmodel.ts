import { SectionInfo } from '@pulp-fiction/models/works';

export class SectionInfoViewModel {
    readonly _id: string;
    title: string;
    published: boolean;
    words: number;
    createdAt: Date;

    constructor(private backingInfo: SectionInfo) {
        this._id = backingInfo._id;
        this.title = backingInfo.title;
        this.published = backingInfo.published;
        this.words = backingInfo.stats.words;
        this.createdAt = backingInfo.createdAt;
    }
}