import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNotification, NotificationSourceKind, PublishStatus, Notification, NotificationSubscription } from '@pulp-fiction/models/notifications';
import { Model, Types } from 'mongoose';
import { NotificationSubscriptionDocument } from './notification-subscriptions.schema';

import { NotificationDocument } from './notifications.schema';
import { UnpublishedNotificationDocument } from './unpublished-notifications.schema';
import { UnsubscribeResult } from './unsubscribe-result.model';

const MAX_NOTIFICATIONS_PER_WAKEUP: number = 100;
const MAX_MS_PER_WAKEUP: number = 100;
const NS_PER_SEC: number = 1_000_000_000;
const NS_PER_MS: number = 1_000_000;

@Injectable()
export class NotificationsService {
    private active: boolean = false;
    private currentWakeup: Promise<void>;

    constructor(@InjectModel('Notification') private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel('UnpublishedNotification') private readonly unpubNotifModel: Model<UnpublishedNotificationDocument>,
        @InjectModel('NotificationSubscription') private readonly subscriptionModel: Model<NotificationSubscriptionDocument>) {
        // Schedule intial wakeup of the unpublished notifications queue processor
        this.beginProcessing();
        console.log("Notifications service constructor complete");
    }

    /**
     * Post a notification to the processing queue, where it will be asynchronously sent to its targets.
     * @param notification The notification to queue for processing.
     */
    async queueNotification(notification: CreateNotification): Promise<void> {
        // Add it to the unpublished notification queue, where it'll (eventually)
        // be processed.
        await new this.unpubNotifModel(notification).save();
    }

    /**
     * Get all unread notifications for the given user.
     * @param userId The ID of the user to retreive notifications for.
     */
    async getUnreadNotifications(userId: string): Promise<Notification[]> {
        return await this.notificationModel.find({
            destinationUserId: userId,
            read: false
        });
    }

    /**
     * Get *all* of a user's notifications.
     * @param userId The ID of the user to retreive notifications for.
     */
    async getAllNotifications(userId: string): Promise<Notification[]> {
        return await this.notificationModel.find({
            destinationUserId: userId
        });
    }

    /**
     * Marks all the given notifications for the given user as read.
     * @param userId The user who owns the notifications
     * @param notificationIds An array of notification IDs to mark as read
     */
    async markAsRead(userId: string, notificationIds: string[]) : Promise<void> {
        const objectIds: Types.ObjectId[] = notificationIds.map(x => new Types.ObjectId(x));
        const result = await this.notificationModel.updateMany({
            '_id': { $in: objectIds },
            'destinationUserId': userId,
            'read': false
        }, {
            $set: { 'read': true }
        });

        if(result.ok !== 1) {
            throw new InternalServerErrorException(`Failed to mark as read. Matched ${result.n} documents, and modified ${result.nModified}`);
        }
    }

    /**
     * Subscribes a user to a notification source.
     * @param userId The user to subscribe
     * @param sourceId The ID of the thing the user would like to subscribe to
     * @param sourceKind The kind of notifications the notification source emits
     */
    async subscribe(userId: string, sourceId: string, sourceKind: NotificationSourceKind): Promise<void> {
        const existingSubscription = await this.subscriptionModel.findOne({
            userId: userId, 
            notificationSourceKind: sourceKind, 
            notificationSourceId: sourceId
        });

        // User is already subscribed, we're cool.
        if (existingSubscription) {
            return;
        }
       
        await new this.subscriptionModel({
            'userId': userId,
            'notificationSourceId': sourceId,
            'notificationSourceKind': sourceKind
        }).save();       
    }

    /**
     * Returns all of a user's notification subscriptions.
     * @param userId The ID of the user whose subscriptions will be returned
     */
    async getSubscriptions(userId: string): Promise<NotificationSubscription[]> {
        return await this.subscriptionModel.find({
            userId: userId
        });
    }

    /**
     * Unsubscribes a user from a notification source.
     * @param userId The user to unsubscribe.
     * @param sourceId The ID of the thing the user would like to unsubscribe from
     * @param sourceKind The kind of notifications the notification source emits
     * @returns `UnsubscribeResult.NotFound` if the user was not subscribed to the given sourceId and sourceKind. 
     * `UnsubscribeResult.Failure` on other errors. `UnsubscribeResult.Success` on success.
     */
    async unsubscribe(userId: string, sourceId: string, sourceKind: NotificationSourceKind): Promise<UnsubscribeResult> {
        const deleteResult = await this.subscriptionModel.deleteOne({
            userId: userId,
            notificationSourceId: sourceId,
            notificationSourceKind: sourceKind
        });        
        if (deleteResult.ok !== 1) {
            return UnsubscribeResult.Failure;
        }
        if (deleteResult.deletedCount !== 1) {
            return UnsubscribeResult.NotFound;
        }

        return UnsubscribeResult.Success;
    }

    /**
     * If not already active, begins processing the unpublished notifications queue.
     */
    beginProcessing(): void {
        if (this.active) {
            return;
        }

        this.active = true;        
        setImmediate(async () =>{
            this.currentWakeup = this.processUnpublishedNotifications(MAX_NOTIFICATIONS_PER_WAKEUP);
            await this.currentWakeup;
        });
    }

    /**
     * Notifies the processing queue to stop. 
     * 
     * If a notification is currently being processed, it will run to completion 
     * before processing shuts down. Once the Promise returned by this method 
     * resolves, processing is fully complete.
     */
    endProcessing(): Promise<void> {
        this.active = false;
        return this.currentWakeup;
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
        if (!this.active) {
            return;
        }
        
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

        // Put stale notifications back into the processing queue
        await this.cleanUpStaleNotifications();

        // Queue the next wakeup        
        setTimeout(
            async () => {                
                this.currentWakeup = this.processUnpublishedNotifications(MAX_NOTIFICATIONS_PER_WAKEUP);
                await this.currentWakeup;
            },
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

