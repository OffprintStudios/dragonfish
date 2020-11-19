import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { HookNextFunction, Schema } from 'mongoose';

import { getBlogNotificationSubSchema, getSectionNotificationSubSchema, getWorkNotificationSubSchema, NotificationSchema } from './notifications.schema';
import { NotificationQueueDocument, NotificationQueueSchema } from './notification-queue.schema';
import { NotificationsService } from './notifications.service';
import { NotificationSubscriptionSchema } from './notification-subscriptions.schema';
import { NotificationQueueDocumentKind } from './notificationQueue/notification-queue-document-kind';
import { NotificationDocumentKind } from './publishedNotifications/notification-document-kind';
import { ContentKind } from '@pulp-fiction/models/content';

const NOTIFICATION_MOODEL: string = 'Notification';
const NOTIFICATION_QUEUE_MODEL: string = 'NotificationQueue';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: NOTIFICATION_MOODEL,
        useFactory: () => {
          const schema = NotificationSchema;          
          return schema;
        }
      },
      {
        name: NOTIFICATION_QUEUE_MODEL,
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
  providers: [NotificationsService,

  // All the NotificationQueue models
  {
    provide: getModelToken('WorkNotificationQueueItem'),
    useFactory: notificationQueueModel => notificationQueueModel.discriminator(NotificationQueueDocumentKind.NQDKWorkNotification, new Schema({
      // WorkNotifications
    })),
    inject: [getModelToken(NOTIFICATION_QUEUE_MODEL)]
  },
  {
    provide: getModelToken('SectionNotificationQueueItem'),
    useFactory: notificationQueueModel => notificationQueueModel.discriminator(NotificationQueueDocumentKind.NQDKSectionNotification, new Schema({
      // Section notifications
    })),
    inject: [getModelToken(NOTIFICATION_QUEUE_MODEL)]
  },
  {
    provide: getModelToken('BlogNotificationQueueItem'),
    useFactory: notificationQueueModel => notificationQueueModel.discriminator(NotificationQueueDocumentKind.NQDKBlogNotification, new Schema({      
      authorId: {type: String, trim: true, required: true},
      authorName: {type: String, required: true},
    })),
    inject: [getModelToken(NOTIFICATION_QUEUE_MODEL)]
  },
  {
    provide: getModelToken('CommentNotificationQueueItem'),
    useFactory: notificationQueueModel => notificationQueueModel.discriminator(NotificationQueueDocumentKind.NQDKCommentNotification, new Schema({
      commenterName: { type: String, required: true },
      commenterId: { type: String, required: true, trim: true },
      parentKind: { type: String, required: true, enum: Object.keys(ContentKind), default: ContentKind.WorkContent},
      parentId: { type: String, required: true, trim: true},
      parentTitle: { type: String, required: true }
    })),
    inject: [getModelToken(NOTIFICATION_QUEUE_MODEL)]
  },
  {
    provide: getModelToken('NewsPostNotificationQueueItem'),
    useFactory: notificationQueueModel => notificationQueueModel.discriminator(NotificationQueueDocumentKind.NQDKNewsPostNotification, new Schema({
      // News post notifications
    })),
    inject: [getModelToken(NOTIFICATION_QUEUE_MODEL)]
  },
  {
    provide: getModelToken('PMThreadNotificationQueueItem'),
    useFactory: notificationQueueModel => notificationQueueModel.discriminator(NotificationQueueDocumentKind.NQDKPMThreadNotification, new Schema({
      // PM thread notifications
    })),
    inject: [getModelToken(NOTIFICATION_QUEUE_MODEL)]
  },
  {
    provide: getModelToken('PMReplyNotificationQueueItem'),
    useFactory: notificationQueueModel => notificationQueueModel.discriminator(NotificationQueueDocumentKind.NQDKPMReplyNotification, new Schema({
      // PM reply notifications
    })),
    inject: [getModelToken(NOTIFICATION_QUEUE_MODEL)]
  },
  

  // All the Notification models
  {
    provide: getModelToken('WorkNotification'),
    useFactory: notificationModel => getWorkNotificationSubSchema(notificationModel),
    inject: [getModelToken(NOTIFICATION_MOODEL)]
  },
  {
    provide: getModelToken('SectionNotification'),
    useFactory: notificationModel => getSectionNotificationSubSchema(notificationModel),
    inject: [getModelToken(NOTIFICATION_MOODEL)]
  },
  {
    provide: getModelToken('BlogNotification'),
    useFactory: notificationModel => getBlogNotificationSubSchema(notificationModel),
    inject: [getModelToken(NOTIFICATION_MOODEL)]
  },
  {
    provide: getModelToken('CommentNotification'),
    useFactory: notificationModel => notificationModel.discriminator(NotificationDocumentKind.NDKCommentNotification, new Schema({
      commenterName: { type: String, required: true },
      commenterId: { type: String, required: true, trim: true },
      parentKind: { type: String, required: true, enum: Object.keys(ContentKind), default: ContentKind.WorkContent},
      parentId: { type: String, required: true, trim: true},
      parentTitle: { type: String, required: true }
    })),
    inject: [getModelToken(NOTIFICATION_MOODEL)]
  },
  {
    provide: getModelToken('NewsPostNotification'),
    useFactory: notificationModel => notificationModel.discriminator(NotificationDocumentKind.NDKNewsPostNotification, new Schema({
      // News post notifications
    })),
    inject: [getModelToken(NOTIFICATION_MOODEL)]
  },
  {
    provide: getModelToken('PMThreadNotification'),
    useFactory: notificationModel => notificationModel.discriminator(NotificationDocumentKind.NDKPMThreadNotification, new Schema({
      // PM thread notifications
    })),
    inject: [getModelToken(NOTIFICATION_MOODEL)]
  },
  {
    provide: getModelToken('PMReplyNotification'),
    useFactory: notificationModel => notificationModel.discriminator(NotificationDocumentKind.NDKPMReplyNotification, new Schema({
      // PM reply notifications
    })),
    inject: [getModelToken(NOTIFICATION_MOODEL)]
  },
],
  exports: [NotificationsService],
})
export class NotificationsModule {}
