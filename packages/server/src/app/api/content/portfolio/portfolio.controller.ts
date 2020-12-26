import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { Cookies } from '@nestjsplus/cookies';

import { ContentFilter } from '@pulp-fiction/models/works';

import { WorksService } from '../../../db/works/works.service';
import { UsersService } from '../../../db/users/users.service';
import { OptionalAuthGuard } from '../../../guards';
import { CollectionsService } from '../../../db/collections/collections.service';
import { ContentService } from '../../../db/content';


@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly usersService: UsersService,
        private readonly collsService: CollectionsService,
        private readonly contentService: ContentService) {}

    @Get('get-user-info/:userId')
    async getUserInfo(@Param('userId') userId: string) {
        return await this.usersService.getOneUser(userId);
    }

    @Get('get-port-collections/:userId/:pageNum')
    async getPortCollections(@Param('userId') userId: string, @Param('pageNum') pageNum: number) {
        return await this.collsService.getPortfolioCollections(userId, pageNum);
    }

    @Get('get-one-collection/:userId/:collId')
    async getOneCollection(@Param('userId') userId: string, @Param('collId') collId: string) {
        return await this.collsService.getOnePortCollection(userId, collId);
    }
}
