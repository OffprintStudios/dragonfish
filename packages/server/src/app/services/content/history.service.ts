import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { ReadingHistory } from '@dragonfish/models/reading-history';
import { JwtPayload } from '@dragonfish/models/auth';
import { ReadingHistoryStore } from '../../db/reading-history/reading-history.store';
import { IHistory } from '../../shared/content';

@Injectable()
export class HistoryService implements IHistory {
    constructor(private readonly history: ReadingHistoryStore) {}

    async addOrUpdateHistory(user: JwtPayload, contentId: string): Promise<ReadingHistory> {
        return await this.history.addOrUpdateHistory(user, contentId);
    }

    async fetchUserHistory(user: JwtPayload, pageNum: number): Promise<PaginateResult<ReadingHistory>> {
        return await this.history.fetchUserHistory(user, pageNum);
    }

    async fetchUserSidenavHistory(user: JwtPayload): Promise<ReadingHistory[]> {
        return await this.history.fetchUserSidenavHistory(user);
    }

    async fetchOneHistoryDoc(user: JwtPayload, contentId: string): Promise<ReadingHistory> {
        return await this.history.fetchOneHistoryDoc(user, contentId);
    }

    async changeVisibility(user: JwtPayload, histId: string): Promise<void> {
        return await this.history.changeVisibility(user, histId);
    }
}
