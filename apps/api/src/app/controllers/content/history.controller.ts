import { Controller, UseGuards, Request, Param, Get, Post, Patch, Inject, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/shared/models/users';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { User } from '../../util/decorators';
import { IHistory } from '../../shared/content';

@Controller('history')
export class HistoryController {
    constructor(@Inject('IHistory') private readonly history: IHistory) {}

    @ApiTags(DragonfishTags.History)
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-history')
    async fetchUserHistory(@User() user: JwtPayload) {
        return await this.history.fetchUserHistory(user);
    }

    @ApiTags(DragonfishTags.History)
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one-hist-doc/:workId')
    async fetchOneHistDoc(@User() user: JwtPayload, @Param('workId') workId: string) {
        return await this.history.fetchOneHistoryDoc(user, workId);
    }

    @ApiTags(DragonfishTags.History)
    @UseGuards(RolesGuard([Roles.User]))
    @Post('add-or-update-history/:workId')
    async addOrUpdateHistory(@User() user: JwtPayload, @Param('workId') workId: string) {
        return await this.history.addOrUpdateHistory(user, workId);
    }

    @ApiTags(DragonfishTags.History)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-visibility')
    async changeVisibility(@User() user: JwtPayload, @Body() ids: { histIds: string[] }) {
        return await this.history.changeVisibility(user, ids.histIds);
    }
}
