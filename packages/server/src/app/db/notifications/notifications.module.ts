import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './notifications.schema';
import { UnpublishedNotificationSchema } from './unpublished-notifications.schema';
import { NotificationsService } from './notifications.service';
import { UnpublishedNotificationsService } from './unpublished-notifications.service';
import { NotificationSubscriptionSchema } from './notification-subscriptions.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Notification',
        useFactory: () => {
          const schema = NotificationSchema;
          return schema;
        }
      },
      {
        name: 'UnpublishedNotification',
        useFactory: () => {
          const schema = UnpublishedNotificationSchema;
          return schema;
        }
      },
      {
        name: 'NotificationSubscription',
        useFactory: () => {
          const schema = NotificationSubscriptionSchema;
          return schema;
        }
      }
    ])
  ],  
  providers: [NotificationsService, UnpublishedNotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
