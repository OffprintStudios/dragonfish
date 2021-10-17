import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { NotificationStore } from '../db/stores';
import { Identity } from '@dragonfish/api/utilities/decorators';
import { IdentityGuard } from '@dragonfish/api/utilities/guards';
import { Roles } from '@dragonfish/shared/models/accounts';
import { MarkAsRead } from '@dragonfish/shared/models/accounts/notifications';

@UseGuards(IdentityGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notifications: NotificationStore) {}

    @Identity(Roles.User)
    @Get('all-unread')
    async getAllUnread(@Query('pseudId') pseudId: string) {
        return await this.notifications.fetchAllUnread(pseudId);
    }

    @Identity(Roles.User)
    @Get('all-read')
    async getAllRead(@Query('pseudId') pseudId: string) {
        return await this.notifications.fetchAllRead(pseudId);
    }

    @Identity(Roles.User)
    @Patch('mark-as-read')
    async markAsRead(@Query('pseudId') pseudId: string, @Body() toMark: MarkAsRead) {
        return await this.notifications.markAsRead(pseudId, toMark.ids);
    }
}
