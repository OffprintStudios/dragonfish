import { Controller } from '@nestjs/common';
import { NotificationStore } from '../db/stores';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notifications: NotificationStore) {}
}
