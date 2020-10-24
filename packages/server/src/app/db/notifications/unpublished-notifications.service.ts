import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { performance } from 'perf_hooks';

import { NotificationSubscriptionDocument } from './notification-subscriptions.schema';
import { NotificationDocument } from './notifications.schema';
import { UnpublishedNotificationDocument } from './unpublished-notifications.schema';

@Injectable()
export class UnpublishedNotificationsService {
    constructor(@InjectModel('UnpublishedNotification') private readonly unpubNotifModel: Model<UnpublishedNotificationDocument>,
        @InjectModel('NotificationSubscription') private readonly subscriptionModel: Model<NotificationSubscriptionDocument>,
        @InjectModel('Notification') private readonly notificationModel: Model<NotificationDocument>) {

        // Set up per-tick callback
        setImmediate(async () => await this.processNotifications(100));
    }

    async processNotifications(numToProcess: number) { 
        performance.mark('processNotifications start');

        // Get the next numToProcess unpublished notifications.
         const toPublish = await this.unpubNotifModel.find()
            .sort({createdAt: 1 })
            .limit(numToProcess);         

        // TODO: Potential perf gain here: create a bunch of promises then await them all,
        // insteading of awaiting them one-by-one
        for (const unpubNotification of toPublish) {
            // Get all the users subscribed to its sourceId from the notificationSubscription collection
            const subscribers = await this.subscriptionModel.find({notificationSourceId: unpubNotification.sourceId})
            
            // TODO: Perf gain here the same way
            for (const subscriber of subscribers) {
                await new this.notificationModel({
                    destinationUserId: subscriber.userId,
                    kind: unpubNotification.kind,
                    sourceId: unpubNotification.sourceId,
                    title: unpubNotification.title,
                    body: unpubNotification.body,
                    sourceParentId: unpubNotification.sourceParentId,
                    createdAt: unpubNotification.createdAt,
                }).save();
            }
        }
         // Now that they've been published, remove the notifications from the Unpublished collection
         const deleteResult = await this.unpubNotifModel.deleteMany({_id: {$in: toPublish.map(x => x._id) }});

         // Debugging info. Removable.
         performance.mark('processNotifications end');
         performance.measure('processNotifications one iteration', 'processNotifications start', 'processNotifications end');
         const perfEntry = performance.getEntriesByName('processNotifications one iteration')[0];
         console.log(`Processed ${toPublish.length} notifications. Afterward, deleted ${deleteResult.deletedCount} unpublished notifications.\nExecution time: ${perfEntry.duration}ms`);
         performance.clearMeasures('processNotifications one iteration');

        // Queue up another run once this one completes
        setTimeout(
            async () => await this.processNotifications(numToProcess),
            100 // ms to sleep between iterations
        );
    }
}
