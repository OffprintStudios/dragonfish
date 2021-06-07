import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

/* Controllers */
import { NotificationsController } from './controllers/notifications.controller';

/* Services */
import { NotificationsService, NotificationsProcessor } from './services';

@Module({
    imports: [BullModule.registerQueue({ name: 'notifications' })],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsProcessor],
    exports: [],
})
export class NotificationsModule {}
