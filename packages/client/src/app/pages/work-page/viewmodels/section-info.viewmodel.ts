import { SectionInfo } from '@pulp-fiction/models/works';

/**
 * A mutable view over `SectionInfo`, to be used by the frontend in instances where we need to modify
 * displayed data without getting new data from the backend.
 */
export class SectionInfoViewModel {
    readonly _id: string;
    title: string;
    published: boolean;
    words: number;
    createdAt: Date;

    constructor(backingInfo: SectionInfo) {
        this._id = backingInfo._id;
        this.title = backingInfo.title;
        this.published = backingInfo.published;
        this.words = backingInfo.stats.words;
        this.createdAt = backingInfo.createdAt;
    }
}