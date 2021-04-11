import { Controller, UseGuards, Param, Get, Put, Body, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/shared/models/users';
import { CreateResponse, CreateInitialMessage } from '@dragonfish/shared/models/messages';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { IMessages } from '../../shared/content';
import { User } from '../../util/decorators';

@Controller('messages')
export class MessagesController {
    constructor(@Inject('IMessages') private readonly messages: IMessages) {}

    @ApiTags(DragonfishTags.Messages)
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-threads/:pageNum')
    async fetchUserThreads(@User() user: JwtPayload, @Param('pageNum') pageNum: number) {
        return await this.messages.fetchThreads(user, pageNum);
    }

    @ApiTags(DragonfishTags.Messages)
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-sidenav-threads')
    async fetchUserSidenavThreads(@User() user: JwtPayload) {
        return await this.messages.fetchSidenavThreads(user);
    }

    @ApiTags(DragonfishTags.Messages)
    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-new-private-thread')
    async createNewPrivateThread(@User() user: JwtPayload, @Body() initialMessage: CreateInitialMessage) {
        console.log(initialMessage);
        return await this.messages.createNewPrivateThread(user, initialMessage);
    }

    @ApiTags(DragonfishTags.Messages)
    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-response')
    async createResponse(@User() user: JwtPayload, @Body() response: CreateResponse) {
        return await this.messages.createResponse(user, response);
    }
}
