import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MetaService } from '../../services/admin/meta.service';
import { FrontendUser } from '@dragonfish/models/users';
import { FrontPageStats } from '@dragonfish/models/stats';

@Controller('meta')
export class MetaController {
    constructor (private readonly meta: MetaService) {}

    @ApiTags('meta')
    @Get('site-staff')
    async getSiteStaff(): Promise<FrontendUser[]> {
        return await this.meta.getSiteStaff();
    }

    @ApiTags('meta')
    @Get('supporters')
    async getSupporters(): Promise<FrontendUser[]> {
        return await this.meta.getSupporters();
    }

    @ApiTags('meta')
    @Get('front-page-stats')
    async getFooterStats(): Promise<FrontPageStats> {
        return await this.meta.getFrontPageStats();
    }
}