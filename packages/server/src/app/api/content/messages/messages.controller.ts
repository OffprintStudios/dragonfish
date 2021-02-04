import { Controller, UseGuards, Request, Param, Get, Put, Body } from '@nestjs/common';

import { RolesGuard } from '../../../guards';
import { Roles } from '@dragonfish/models/users';
import { CreateResponse, CreateInitialMessage } from '@dragonfish/models/messages';
import { MessagesService } from '../../../db/messages/messages.service';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messageService: MessagesService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-threads/:pageNum')
    async fetchUserThreads(@Request() req: any, @Param('pageNum') pageNum: number) {
        return await this.messageService.fetchThreads(req.user, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-sidenav-threads')
    async fetchUserSidenavThreads(@Request() req: any) {
        return await this.messageService.fetchSidenavThreads(req.user);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-new-private-thread')
    async createNewPrivateThread(@Request() req: any, @Body() initialMessage: CreateInitialMessage) {
        console.log(initialMessage);
        return await this.messageService.createNewPrivateThread(req.user, initialMessage);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-response')
    async createResponse(@Request() req: any, @Body() response: CreateResponse) {
        return await this.messageService.createResponse(req.user, response);
    }
}
