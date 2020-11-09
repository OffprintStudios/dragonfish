import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './notifications.schema';
import { NotificationQueueDocument, NotificationQueueSchema } from './notification-queue.schema';
import { NotificationsService } from './notifications.service';
import { NotificationSubscriptionSchema } from './notification-subscriptions.schema';
import { HookNextFunction } from 'mongoose';

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
        name: 'NotificationQueue',
        useFactory: () => {
          const schema = NotificationQueueSchema;
          schema.pre<NotificationQueueDocument>('save', async function(next: HookNextFunction) {
            this.set('createdAt', Date.now());
            this.set('updatedAt', Date.now());
            return next();
          });
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
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
