import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationSubscriptionDocument } from './notification-subscriptions.schema';
import { NotificationDocument } from './notifications.schema';
import { UnpublishedNotificationDocument } from './unpublished-notifications.schema';

@Injectable()
export class UnpublishedNotificationsService {
    constructor(@InjectModel('UnpublishedNotification') private readonly unpubNotifModel: UnpublishedNotificationDocument,
        @InjectModel('NotificationSubscription') private readonly subscriptionModel: NotificationSubscriptionDocument,
        @InjectModel('Notification') private readonly notificationModel: NotificationDocument) {

        // Set up per-tick callback
        setImmediate(async () => await this.processNotifications(100));
    }

    async processNotifications(numToProcess: number) { 
         await Promise.resolve(); // dummy, remove me         

         // Get the next numToProcess notifications from the DB

         // Get all the users subscribed to its sourceId from the notificationSubscription collection

         // For each user-notif pair add a new notification to the notification collection with the User ID
         // set to the user, and all the info from the UnpublishedNotification

         // Delete all the originally-retrieved Unpublished Notifications from the Unpublished collection

        setTimeout(
            async () => await this.processNotifications(numToProcess),
            100 // ms to sleep between iterations
        );
    }
}
