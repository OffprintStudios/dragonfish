import { Injectable } from '@nestjs/common';
import { RatingsStore } from '@dragonfish/api/database/content/stores';

@Injectable()
export class RatingsService {
    constructor(private readonly ratingsStore: RatingsStore) {}

    public async fetchRatingsDoc(accountId: string, contentId: string) {
        return await this.ratingsStore.addOrFetchRatingsDoc(accountId, contentId);
    }
}
