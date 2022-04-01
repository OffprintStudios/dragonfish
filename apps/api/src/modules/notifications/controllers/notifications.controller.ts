import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ContentUpdatedStore, NotificationStore } from '../db/stores';
import { Identity } from '$shared/auth';
import { IdentityGuard } from '$shared/guards';
import { Roles } from '$shared/models/accounts';
import { MarkAsRead } from '$shared/models/notifications';

@UseGuards(IdentityGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notifications: NotificationStore,
        private readonly contentUpdates: ContentUpdatedStore,
    ) {}

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

    @Identity(Roles.User)
    @Patch('mark-updated-as-read')
    async markUpdatedAsRead(
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
    ) {
        return await this.contentUpdates.markAsRead(pseudId, contentId);
    }
}
