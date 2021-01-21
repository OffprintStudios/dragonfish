import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateNotification, NotificationKind, NotificationBase, NotificationSubscription, BlogNotificationInfo, CommentNotificationInfo} from '@pulp-fiction/models/notifications';

import { NotificationSubscriptionDocument } from './notification-subscriptions.schema';
import { NotificationDocument } from './notifications.schema';
import { NotificationQueueDocument } from './notification-queue.schema';
import { UnsubscribeResult } from './unsubscribe-result.model';
import { PublishStatus } from './notificationQueue/publish-status';
import { WorkNotificationDocument, SectionNotificationDocument, BlogNotificationDocument, 
    CommentNotificationDocument, NewsPostNotificationDocument, PMThreadNotificationDocument,
    PMReplyNotificationDocument} from './publishedNotifications';
import { BlogNotificationQueueDocument } from './notificationQueue/blog-notification-queue.document';
import { WorkNotificationQueueDocument } from './notificationQueue/work-notification-queue.document';
import { SectionNotificationQueueDocument } from './notificationQueue/section-notification-queue.document';
import { CommentNotificationQueueDocument } from './notificationQueue/comment-notification-queue.document';
import { NewsPostNotificationQueueDocument } from './notificationQueue/news-post-notification-queue.document';
import { PMThreadNotificationQueueDocument } from './notificationQueue/pm-thread-notification-queue.document';
import { PMReplyNotificationQueueDocument } from './notificationQueue/pm-reply-notification-queue.document';

const MAX_NOTIFICATIONS_PER_WAKEUP: number = 100;
const MAX_MS_PER_WAKEUP: number = 100;
const NS_PER_SEC: number = 1_000_000_000;
const NS_PER_MS: number = 1_000_000;

@Injectable()
export class NotificationsService {
    private active: boolean = false;
    private currentWakeup: Promise<void>;

    constructor(@InjectModel('Notification') private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel('NotificationSubscription') private readonly subscriptionModel: Model<NotificationSubscriptionDocument>,
        @InjectModel('NotificationQueue') private readonly notificationQueueModel: Model<NotificationQueueDocument>,
        
        @InjectModel('WorkNotificationQueueItem') private readonly workNotificationQueueModel: Model<WorkNotificationQueueDocument>,
        @InjectModel('SectionNotificationQueueItem') private readonly sectionNotificationQueueModel: Model<SectionNotificationQueueDocument>,
        @InjectModel('BlogNotificationQueueItem') private readonly blogNotificationQueueModel: Model<BlogNotificationQueueDocument>,
        @InjectModel('CommentNotificationQueueItem') private readonly commentNotificationQueueModel: Model<CommentNotificationQueueDocument>,
        @InjectModel('NewsPostNotificationQueueItem') private readonly newsPostNotificationQueueModel: Model<NewsPostNotificationQueueDocument>,
        @InjectModel('PMThreadNotificationQueueItem') private readonly pmThreadNotificationQueueModel: Model<PMThreadNotificationQueueDocument>,
        @InjectModel('PMReplyNotificationQueueItem') private readonly pmReplyNotificationQueueModel: Model<PMReplyNotificationQueueDocument>,

        @InjectModel('WorkNotification') private readonly workNotificationModel: Model<WorkNotificationDocument>,
        @InjectModel('SectionNotification') private readonly sectionNotificationModel: Model<SectionNotificationDocument>,
        @InjectModel('BlogNotification') private readonly blogNotificationModel: Model<BlogNotificationDocument>,
        @InjectModel('CommentNotification') private readonly commentNotificationModel: Model<CommentNotificationDocument>,
        @InjectModel('NewsPostNotification') private readonly newsPostNotificationModel: Model<NewsPostNotificationDocument>,
        @InjectModel('PMThreadNotification') private readonly pmThreadNotificationModel: Model<PMThreadNotificationDocument>,
        @InjectModel('PMReplyNotification') private readonly pmReplyNotificationModel: Model<PMReplyNotificationDocument>,) {
        // Schedule intial wakeup of the notification queue processor
        this.beginProcessing();        
    }

    /**
     * Post a notification to the processing queue, where it will be asynchronously sent to its targets.
     * @param notification The notification to queue for processing.
     */
    async queueNotification(notification: CreateNotification): Promise<void> {
        // Add it to the unpublished notification queue, where it'll (eventually)
        // be processed.
        switch (notification.kind) {
            case NotificationKind.BlogNotification: {
                await new this.blogNotificationQueueModel(notification).save();
                break;
            }
            case NotificationKind.CommentNotification: {
                await new this.commentNotificationQueueModel(notification).save();
                break;
            }
            case NotificationKind.NewsPostNotification: {
                await new this.newsPostNotificationQueueModel(notification).save();
                break;
            }
            case NotificationKind.PMReplyNotification: {
                await new this.pmReplyNotificationQueueModel(notification).save();
                break;
            }
            case NotificationKind.PMThreadNotification: {
                await new this.pmThreadNotificationQueueModel(notification).save();
                break;
            }
            case NotificationKind.SectionNotification: {
                await new this.sectionNotificationQueueModel(notification).save();
                break;
            }
            case NotificationKind.WorkNotification: {
                await new this.workNotificationQueueModel(notification).save();
                break;
            }
        }
    }

    /**
     * Get all unread notifications for the given user.
     * @param userId The ID of the user to retreive notifications for.
     */
    async getUnreadNotifications(userId: string): Promise<NotificationBase[]> {
        return await this.notificationModel.find({
            destinationUserId: userId,
            read: false
        });
    }

    /**
     * Get *all* of a user's notifications.
     * @param userId The ID of the user to retreive notifications for.
     */
    async getAllNotifications(userId: string): Promise<NotificationBase[]> {
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
     * @param notificationKind The kind of notifications the notification source emits
     */
    async subscribe(userId: string, sourceId: string, notificationKind: NotificationKind): Promise<void> {
        const existingSubscription = await this.subscriptionModel.findOne({
            userId: userId, 
            notificationKind: notificationKind, 
            notificationSourceId: sourceId
        });

        // User is already subscribed, we're cool.
        if (existingSubscription) {
            return;
        }
       
        const subscription: NotificationSubscription = {
            userId: userId,
            notificationKind: notificationKind,
            notificationSourceId: sourceId
        };
        await new this.subscriptionModel(subscription).save();       
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
     * @param notificationKind The kind of notifications the notification source emits
     * @returns `UnsubscribeResult.NotFound` if the user was not subscribed to the given sourceId and sourceKind. 
     * `UnsubscribeResult.Failure` on other errors. `UnsubscribeResult.Success` on success.
     */
    async unsubscribe(userId: string, sourceId: string, notificationKind: NotificationKind): Promise<UnsubscribeResult> {
        const deleteResult = await this.subscriptionModel.deleteOne({
            userId: userId,
            notificationSourceId: sourceId,
            notificationKind: notificationKind
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
        let toPublish: NotificationQueueDocument;

        // Note: Since NotificationQueue is a capped collection, an unsorted .find() 
        // is guaranteed to get documents in original insertion order.
        while ((toPublish = await this.notificationQueueModel.findOneAndUpdate(
            { publishStatus: PublishStatus.NotStarted },
            { $set: { publishStatus: PublishStatus.InProgress, updatedAt: new Date(Date.now()) } },
            { new: true }
        )) !== null) {
            try {
                // Get all the users subscribed to its sourceId from the notificationSubscription collection                
                const subscribers = await this.subscriptionModel.find(
                    { notificationSourceId: toPublish.sourceId, notificationKind: toPublish.kind }
                );
                
                // Publish this notification to all subscribers.
                const publishableNotifications: NotificationDocument[] = subscribers.map(x =>
                    this.getSpecificNotificationModel(x, toPublish)
                );
                await this.notificationModel.insertMany(publishableNotifications);

                // Mark the notification in the NotificationQueue collection as "Published"
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
                    console.error(`Error processing notification from queue - ${error.name}: ${error.message}\n${error.stack}`);
                } else {
                    console.error(`Error processing notification from queue - ${error}`);
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
        const staleNotifications: NotificationQueueDocument[] = await this.notificationQueueModel.find(
            { publishStatus: PublishStatus.InProgress, updatedAt: { $lte: nowMinus10s } }
        );
        await Promise.all(staleNotifications.map(x => {
            x.publishStatus = PublishStatus.NotStarted;
            return x.save();
        }));
    }

    private getSpecificNotificationModel(subscription: NotificationSubscriptionDocument, toPublish: NotificationQueueDocument): NotificationDocument {
        const commonProperties: NotificationBase = {
            _id: undefined,
            destinationUserId: subscription.userId,
            sourceId: toPublish.sourceId,
            kind: toPublish.kind,            
            read: false,
            createdAt: toPublish.createdAt,
            updatedAt: new Date(Date.now()),
        };        

        switch (subscription.notificationKind) {            
            case NotificationKind.BlogNotification: {
                return this.getBlogNotification(toPublish, commonProperties);
            }
            case NotificationKind.CommentNotification: {
                return this.getCommentNotification(toPublish, commonProperties);
            }
            case NotificationKind.NewsPostNotification: {
                return this.getNewsPostNotification(toPublish, commonProperties);
            }
            case NotificationKind.PMReplyNotification: {
                return this.getPMReplyNotification(toPublish, commonProperties);
            }
            case NotificationKind.PMThreadNotification: {
                return this.getPMThreadNotification(toPublish, commonProperties);
            }
            case NotificationKind.SectionNotification: {
                return this.getSectionNotification(toPublish, commonProperties);
            }
            case NotificationKind.WorkNotification: {
                return this.getWorkNotification(toPublish, commonProperties);
            }
            default: {
                throw new Error(`Unsupported NotificationKind: ${subscription.notificationKind}`);
            }
        }
    }

    private getCommentNotification(toPublish: NotificationQueueDocument, commonProperties: NotificationBase) {
        const queuedCommentNotification = toPublish as CommentNotificationQueueDocument;
        const commentInfo: CommentNotificationInfo = {
            ...commonProperties,
            commentId: queuedCommentNotification.commentId,
            commenterId: queuedCommentNotification.commenterId,
            commenterName: queuedCommentNotification.commenterName,            
            parentKind: queuedCommentNotification.parentKind,
            parentTitle: queuedCommentNotification.parentTitle,
        };

        return new this.commentNotificationModel({            
            ...commentInfo
        });
    }

    private getBlogNotification(toPublish: NotificationQueueDocument, commonProperties: NotificationBase) {
        const queuedBlogNotification = toPublish as BlogNotificationQueueDocument;
        const blogInfo: BlogNotificationInfo = {
            ...commonProperties,
            authorId: queuedBlogNotification.authorId,
            authorName: queuedBlogNotification.authorName,
        };

        return new this.blogNotificationModel({            
            ...blogInfo,
        });
    }
    
    private getNewsPostNotification(toPublish: NotificationQueueDocument, commonProperties: NotificationBase) {
        const queuedNewsPostNotification = toPublish as NewsPostNotificationQueueDocument;
        return new this.newsPostNotificationModel({
            ...commonProperties,
        });
    }

    private getPMReplyNotification(toPublish: NotificationQueueDocument, commonProperties: NotificationBase) {
        const queuedPMReplyNotification = toPublish as PMReplyNotificationQueueDocument;
        return new this.pmReplyNotificationModel({
            ...commonProperties,
        });
    }
    
    private getPMThreadNotification(toPublish: NotificationQueueDocument, commonProperties: NotificationBase) {
        const queuedPMThreadNotification = toPublish as PMThreadNotificationQueueDocument;
        return new this.pmThreadNotificationModel({
            ...commonProperties,
        });
    }
    
    private getSectionNotification(toPublish: NotificationQueueDocument, commonProperties: NotificationBase) {
        const queuedSectionNotification = toPublish as SectionNotificationQueueDocument;
        return new this.sectionNotificationModel({
            ...commonProperties,
        });
    }
    
    private getWorkNotification(toPublish: NotificationQueueDocument, commonProperties: NotificationBase) {
        const queuedWorkNotification = toPublish as WorkNotificationQueueDocument;
        return new this.workNotificationModel({
            ...commonProperties,
        });
    }
}

