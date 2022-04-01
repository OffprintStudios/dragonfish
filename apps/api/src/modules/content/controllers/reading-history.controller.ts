import { Controller, UseGuards, Param, Get, Patch, Body } from '@nestjs/common';
import { RolesGuard } from '$shared/guards';
import { Roles } from '$shared/models/accounts';
import { JwtPayload, Identity, User } from '$shared/auth';
import { ReadingHistoryService } from '../services';

@Controller('history')
export class ReadingHistoryController {
    constructor(private readonly history: ReadingHistoryService) {}

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Get('fetch-user-history')
    async fetchUserHistory(@User() user: JwtPayload) {
        return await this.history.fetchUserHistory(user);
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Get('fetch-one-hist-doc/:workId')
    async fetchOneHistDoc(@User() user: JwtPayload, @Param('workId') workId: string) {
        return await this.history.fetchOneHistoryDoc(user, workId);
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Patch('change-visibility')
    async changeVisibility(@User() user: JwtPayload, @Body() ids: { histIds: string[] }) {
        return await this.history.changeVisibility(user, ids.histIds);
    }
}
