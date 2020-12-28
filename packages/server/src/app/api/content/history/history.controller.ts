import { Controller, UseGuards, Request, Param, Get, Post, Patch } from '@nestjs/common';

import { RolesGuard } from '../../../guards';
import { Roles } from '@pulp-fiction/models/users';
import { ReadingHistoryService } from '../../../db/reading-history/reading-history.service';

@Controller('history')
export class HistoryController {
    constructor(private readonly histService: ReadingHistoryService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-history/:pageNum')
    async fetchUserHistory(@Request() req: any, @Param('pageNum') pageNum: number) {
        return await this.histService.fetchUserHistory(req.user.sub, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-sidenav-history')
    async fetchUserSidenavHistory(@Request() req: any) {
        return await this.histService.fetchUserSidenavHistory(req.user.sub);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one-hist-doc/:workId')
    async fetchOneHistDoc(@Request() req: any, @Param('workId') workId: string) {
        return await this.histService.fetchOneHistoryDoc(req.user.sub, workId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Post('add-or-update-history/:workId')
    async addOrUpdateHistory(@Request() req: any, @Param('workId') workId: string) {
        return await this.histService.addOrUpdateHistory(req.user.sub, workId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-item-visibility/:histId')
    async changeItemVisibility(@Request() req: any, @Param('histId') histId: string) {
        return await this.histService.changeVisibility(req.user.sub, histId);
    }
}
