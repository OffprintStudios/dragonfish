import { Controller, UseGuards, Request, Param, Get, Post, Patch, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/models/users';
import { JwtPayload } from '@dragonfish/models/auth';
import { User } from '../../util/decorators';
import { IHistory } from '../../shared/content';

@Controller('history')
export class HistoryController {
    constructor(@Inject('IHistory') private readonly history: IHistory) {}

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-history/:pageNum')
    async fetchUserHistory(@User() user: JwtPayload, @Param('pageNum') pageNum: number) {
        return await this.history.fetchUserHistory(user, pageNum);
    }

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-sidenav-history')
    async fetchUserSidenavHistory(@User() user: JwtPayload) {
        return await this.history.fetchUserSidenavHistory(user);
    }

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one-hist-doc/:workId')
    async fetchOneHistDoc(@User() user: JwtPayload, @Param('workId') workId: string) {
        return await this.history.fetchOneHistoryDoc(user, workId);
    }

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Post('add-or-update-history/:workId')
    async addOrUpdateHistory(@User() user: JwtPayload, @Param('workId') workId: string) {
        return await this.history.addOrUpdateHistory(user, workId);
    }

    @ApiTags('History')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-item-visibility/:histId')
    async changeItemVisibility(@User() user: JwtPayload, @Param('histId') histId: string) {
        return await this.history.changeVisibility(user, histId);
    }
}
