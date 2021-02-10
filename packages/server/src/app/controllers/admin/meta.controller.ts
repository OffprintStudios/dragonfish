import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FrontendUser } from '@dragonfish/models/users';
import { FrontPageStats } from '@dragonfish/models/stats';
import { DragonfishTags } from '@dragonfish/models/util';
import { IMeta } from '../../shared/admin';

@Controller('meta')
export class MetaController {
    constructor(@Inject('IMeta') private readonly meta: IMeta) {}

    @ApiTags(DragonfishTags.Meta)
    @Get('site-staff')
    async getSiteStaff(): Promise<FrontendUser[]> {
        return await this.meta.getSiteStaff();
    }

    @ApiTags(DragonfishTags.Meta)
    @Get('supporters')
    async getSupporters(): Promise<FrontendUser[]> {
        return await this.meta.getSupporters();
    }

    @ApiTags(DragonfishTags.Meta)
    @Get('public-stats')
    async getPublicStats(): Promise<FrontPageStats> {
        return await this.meta.getPublicStats();
    }
}
