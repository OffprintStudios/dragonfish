import { Controller, UseGuards, Request, Param, Get, Post, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/models/users';
import { ReadingHistoryStore } from '../../db/reading-history/reading-history.store';

@Controller('history')
export class HistoryController {
    constructor(private readonly histService: ReadingHistoryStore) {}

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-history/:pageNum')
    async fetchUserHistory(@Request() req: any, @Param('pageNum') pageNum: number) {
        return await this.histService.fetchUserHistory(req.user, pageNum);
    }

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-sidenav-history')
    async fetchUserSidenavHistory(@Request() req: any) {
        return await this.histService.fetchUserSidenavHistory(req.user);
    }

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one-hist-doc/:workId')
    async fetchOneHistDoc(@Request() req: any, @Param('workId') workId: string) {
        return await this.histService.fetchOneHistoryDoc(req.user, workId);
    }

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Post('add-or-update-history/:workId')
    async addOrUpdateHistory(@Request() req: any, @Param('workId') workId: string) {
        return await this.histService.addOrUpdateHistory(req.user, workId);
    }

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-item-visibility/:histId')
    async changeItemVisibility(@Request() req: any, @Param('histId') histId: string) {
        return await this.histService.changeVisibility(req.user, histId);
    }
}