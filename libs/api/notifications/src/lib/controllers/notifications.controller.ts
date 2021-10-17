import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotificationStore } from '../db/stores';
import { RolesDecorator } from '@dragonfish/api/utilities/decorators';
import { IdentityGuard } from '@dragonfish/api/utilities/guards';
import { Roles } from '@dragonfish/shared/models/accounts';

@UseGuards(IdentityGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notifications: NotificationStore) {}

    @RolesDecorator(Roles.User)
    @Get('all-unread')
    async getAllUnread(@Query('pseudId') pseudId: string) {
        return await this.notifications.fetchAllUnread(pseudId);
    }

    @RolesDecorator(Roles.User)
    @Get('all-read')
    async getAllRead(@Query('pseudId') pseudId: string) {
        return await this.notifications.fetchAllRead(pseudId);
    }
}
