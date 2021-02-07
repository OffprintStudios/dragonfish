import { Controller, Get } from '@nestjs/common';

import { MetaService } from '../../services/admin/meta.service';
import { FrontendUser } from '@dragonfish/models/users';
import { FrontPageStats } from '@dragonfish/models/stats';

@Controller('meta')
export class MetaController {
    constructor (private readonly meta: MetaService) {}

    @Get('site-staff')
    async getSiteStaff(): Promise<FrontendUser[]> {
        return await this.meta.getSiteStaff();
    }

    @Get('supporters')
    async getSupporters(): Promise<FrontendUser[]> {
        return await this.meta.getSupporters();
    }

    @Get('front-page-stats')
    async getFooterStats(): Promise<FrontPageStats> {
        return await this.meta.getFrontPageStats();
    }
}