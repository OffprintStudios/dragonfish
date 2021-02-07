import { FrontPageStats } from '@dragonfish/models/stats';
import { FrontendUser } from '@dragonfish/models/users';
import { Injectable, Logger } from '@nestjs/common';

import { UsersService } from '../../db/users/users.service';

@Injectable()
export class MetaService {
    private readonly logger: Logger = new Logger(MetaService.name);

    constructor (private readonly usersService: UsersService) {}

    /**
     * Gets the list of site staff.
     * 
     * @returns
     */
    async getSiteStaff(): Promise<FrontendUser[]> {
        return await this.usersService.getSiteStaff();
    }

    /**
     * Gets the list of Patreon supporters, VIPs, contributors, and maintainers.
     * 
     * @returns
     */
    async getSupporters(): Promise<FrontendUser[]> {
        return await this.usersService.getSupporters();
    }

    /**
     * Gets the site stats for the footer.
     * 
     * @returns
     */
    async getFrontPageStats(): Promise<FrontPageStats> {
        const stats: FrontPageStats = {
            numUsers: await this.usersService.getUserCount(),
            numWorks: 0
        };

        return stats;
    }
}