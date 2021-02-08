import { Controller, UseGuards, Request, Param, Get, Put, Body, Inject } from '@nestjs/common';

import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/models/users';
import { CreateResponse, CreateInitialMessage } from '@dragonfish/models/messages';
import { IMessages } from '../../shared/content';

@Controller('messages')
export class MessagesController {
    constructor(@Inject('IMessages') private readonly messages: IMessages) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-threads/:pageNum')
    async fetchUserThreads(@Request() req: any, @Param('pageNum') pageNum: number) {
        return await this.messages.fetchThreads(req.user, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-sidenav-threads')
    async fetchUserSidenavThreads(@Request() req: any) {
        return await this.messages.fetchSidenavThreads(req.user);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-new-private-thread')
    async createNewPrivateThread(@Request() req: any, @Body() initialMessage: CreateInitialMessage) {
        console.log(initialMessage);
        return await this.messages.createNewPrivateThread(req.user, initialMessage);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-response')
    async createResponse(@Request() req: any, @Body() response: CreateResponse) {
        return await this.messages.createResponse(req.user, response);
    }
}