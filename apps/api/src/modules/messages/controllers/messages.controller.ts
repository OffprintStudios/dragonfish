import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from '$modules/messages/services';
import { IdentityGuard } from '$shared/guards';
import { Identity } from '$shared/auth';
import { Roles } from '$shared/models/accounts';
import { NewMessageForm } from '$shared/models/messages';

@UseGuards(IdentityGuard)
@Identity(Roles.User)
@Controller('messages')
export class MessagesController {
    constructor(private readonly messages: MessagesService) {}

    @Get('fetch-threads')
    async fetchThreads(@Query('pseudId') pseudId: string) {
        return await this.messages.fetchThreads(pseudId);
    }

    @Get('fetch-thread')
    async fetchThread(@Query('pseudId') pseudId: string, @Query('threadId') threadId: string) {
        return await this.messages.fetchThread(threadId, pseudId);
    }

    @Post('send-message')
    async sendMessage(@Body() newMessage: NewMessageForm) {
        return await this.messages.sendPrivateMessage(newMessage);
    }
}
