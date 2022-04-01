import { Injectable } from '@nestjs/common';
import { RatingsStore } from '../db/stores';

@Injectable()
export class RatingsService {
    constructor(private readonly ratingsStore: RatingsStore) {}

    public async fetchRatingsDoc(accountId: string, contentId: string) {
        return await this.ratingsStore.addOrFetchRatingsDoc(accountId, contentId);
    }
}
