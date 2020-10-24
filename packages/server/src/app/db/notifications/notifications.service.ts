import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNotification, UnpublishedNotification } from '@pulp-fiction/models/notifications';
import { Model } from 'mongoose';
import { NotificationSubscriptionDocument } from './notification-subscriptions.schema';

import { NotificationDocument } from './notifications.schema';
import { UnpublishedNotificationDocument } from './unpublished-notifications.schema';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel('Notification') private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel('UnpublishedNotification') private readonly unpubNotifModel: Model<UnpublishedNotificationDocument>,
        @InjectModel('NotificationSubscription') private readonly subscriptionModel: Model<NotificationSubscriptionDocument>) { }

        async queueNotification(notification: CreateNotification): Promise<void> {
            // Add it to the unpublished notification queue, where it'll (eventually)
            // be processed.
            await new this.unpubNotifModel(notification).save();
        }

        async getUnreadNotifications(userId: string): Promise<Notification[]> {
            throw new Error("Not implemented yet");
        }

        async getAllNotifications(userId: string): Promise<Notification[]> {
            throw new Error("Not implemented yet");
        }

        async subscribe(userId: string, sourceId: string): Promise<void> {
            throw new Error("Not implemented yet");        
        }

        async unsubscribe(userId: string, sourceId: string): Promise<void> {
            throw new Error("Not implemented yet");
        }

}
