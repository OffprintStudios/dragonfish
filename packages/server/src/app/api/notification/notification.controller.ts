import { Controller, Post } from '@nestjs/common';

import { CreateNotification } from '@pulp-fiction/models/notifications';
import { NotificationsService } from '../../db/notifications/notifications.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post('queueNotification')
    async queueNotification(notification: CreateNotification): Promise<void> {
        await this.notificationsService.queueNotification(notification);        
    }
}
