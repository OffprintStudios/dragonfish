import { FrontPageStats } from '@dragonfish/models/stats';
import { FrontendUser } from '@dragonfish/models/users';
import { Injectable, Logger } from '@nestjs/common';

import { UsersStore } from '../../db/users/users.store';
import { IMeta } from '../../shared/admin';

@Injectable()
export class MetaService implements IMeta {
    private readonly logger: Logger = new Logger(MetaService.name);

    constructor(private readonly usersStore: UsersStore) {}

    async getSiteStaff(): Promise<FrontendUser[]> {
        return await this.usersStore.getSiteStaff();
    }

    async getSupporters(): Promise<FrontendUser[]> {
        return await this.usersStore.getSupporters();
    }

    async getPublicStats(): Promise<FrontPageStats> {
        const stats: FrontPageStats = {
            numUsers: await this.usersStore.getUserCount(),
            numWorks: 0,
        };

        return stats;
    }
}
