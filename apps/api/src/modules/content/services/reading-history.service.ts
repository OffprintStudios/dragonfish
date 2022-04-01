import { Injectable } from '@nestjs/common';
import { ReadingHistory } from '$shared/models/reading-history';
import { JwtPayload } from '$shared/auth';
import { ReadingHistoryStore } from '../db/stores';

@Injectable()
export class ReadingHistoryService {
    constructor(private readonly history: ReadingHistoryStore) {}

    async fetchUserHistory(user: JwtPayload): Promise<ReadingHistory[]> {
        return await this.history.fetchUserHistory(user);
    }

    async fetchOneHistoryDoc(user: JwtPayload, contentId: string): Promise<ReadingHistory> {
        return await this.history.fetchOneHistoryDoc(user, contentId);
    }

    async changeVisibility(user: JwtPayload, histIds: string[]): Promise<void> {
        return await this.history.changeVisibility(user, histIds);
    }
}
