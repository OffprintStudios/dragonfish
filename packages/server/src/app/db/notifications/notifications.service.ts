import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNotification, PublishStatus, UnpublishedNotification } from '@pulp-fiction/models/notifications';
import { Model } from 'mongoose';
import { NotificationSubscriptionDocument } from './notification-subscriptions.schema';

import { NotificationDocument } from './notifications.schema';
import { UnpublishedNotificationDocument } from './unpublished-notifications.schema';

const MAX_NOTIFICATIONS_PER_WAKEUP: number = 100;
const MAX_MS_PER_WAKEUP: number = 100;
const NS_PER_SEC: number = 1_000_000_000;
const NS_PER_MS: number = 1_000_000;

@Injectable()
export class NotificationsService {
    constructor(@InjectModel('Notification') private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel('UnpublishedNotification') private readonly unpubNotifModel: Model<UnpublishedNotificationDocument>,
        @InjectModel('NotificationSubscription') private readonly subscriptionModel: Model<NotificationSubscriptionDocument>) {
        // Schedule intial wakeup of the unpublished notifications queue processor
        setImmediate(async () => await this.processUnpublishedNotifications(MAX_NOTIFICATIONS_PER_WAKEUP));
    }

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

    /**
     * A single wakeup of the unpublished notifications queue processor. 
     * Will publish notifications until:
     *  - It has published `numToProcess` notifications
     *  - It exceeds `MAX_MS_PER_WAKEUP` milliseconds run time
     *  - There are no more notifications to process
     * 
     * Once it has completed (one way or another) it will schedule another wakeup 5 seconds in the future.
     * @param numToProcess The max number of notifications to process in this wakeup.
     */
    private async processUnpublishedNotifications(numToProcess: number): Promise<void> {
        const tickStart = process.hrtime();
        let processed: number = 0;
        let toPublish: UnpublishedNotificationDocument;

        // Note: Since UnpublishedNotifications is a capped collection, an unsorted .find() 
        // is guaranteed to get documents in original insertion order.
        while ((toPublish = await this.unpubNotifModel.findOneAndUpdate(
            { publishStatus: PublishStatus.NotStarted },
            { $set: { publishStatus: PublishStatus.InProgress, updatedAt: new Date(Date.now()) } },
            { new: true }
        )) !== null) {
            try {
                // Get all the users subscribed to its sourceId from the notificationSubscription collection
                const subscribers = await this.subscriptionModel.find(
                    { notificationSourceId: toPublish.sourceId, notificationSourceKind: toPublish.sourceKind }
                );

                // Publish this notification to all subscribers.
                const publishableNotifications = subscribers.map(x =>
                    new this.notificationModel({
                        destinationUserId: x.userId,
                        sourceId: toPublish.sourceId,
                        sourceKind: toPublish.sourceKind,
                        title: toPublish.title,
                        body: toPublish.body,
                        sourceParentId: toPublish.sourceParentId,
                        sourceParentKind: toPublish.sourceParentKind,
                        createdAt: toPublish.createdAt,
                        updatedAt: new Date(Date.now()),
                    }));
                await this.notificationModel.insertMany(publishableNotifications);

                // Mark the notification in the Unpublished collection as "Published"
                toPublish.publishStatus = PublishStatus.Published;
                await toPublish.save();

                // Put stale notifications back into the processing queue
                await this.cleanUpStaleNotifications();

                processed += 1;
                if (processed >= numToProcess) {
                    break;
                }

                // If we've exceeded our deadline, end early and sleep
                const [sec, ns] = process.hrtime(tickStart);
                const elapsedMs = (sec * NS_PER_SEC + ns) / NS_PER_MS;
                if (elapsedMs > MAX_MS_PER_WAKEUP) {
                    break;
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Error processing unpublished notification - ${error.name}: ${error.message}\n${error.stack}`);
                } else {
                    console.error(`Error processing unpublished notification - ${error}`);
                }
                
                break;
            }
        } // end while-loop

        // Queue the next wakeup
        setTimeout(
            async () => await this.processUnpublishedNotifications(MAX_NOTIFICATIONS_PER_WAKEUP),
            5000);
    }

    /** Put unpublished notifications that have been "In Progress" for more than 10 seconds back into the queue. */
    private async cleanUpStaleNotifications(): Promise<void> {
        const nowMinus10s = new Date(Date.now() - (10 * 1000));
        const staleNotifications: UnpublishedNotificationDocument[] = await this.unpubNotifModel.find(
            { publishStatus: PublishStatus.InProgress, updatedAt: { $lte: nowMinus10s } }
        );
        await Promise.all(staleNotifications.map(x => {
            x.publishStatus = PublishStatus.NotStarted;
            return x.save();
        }));
    }
}

