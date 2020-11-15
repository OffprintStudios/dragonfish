import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationKind } from '@pulp-fiction/models/notifications';

import { NotificationQueueItem } from './notificationQueue/notification-queue-item.model';
import { PublishStatus } from './notificationQueue/publish-status';
import { NotificationQueueDocumentKind } from './notificationQueue/notification-queue-document-kind';

const FiveMB: number = 5_242_880; // Even this is probably overkill

@Schema({    
    timestamps: true,
    capped: { size: FiveMB },
    collection: 'notification_queue',
    discriminatorKey: 'nqdKind'
})
export class NotificationQueueDocument extends Document implements NotificationQueueItem {
    @Prop({required: true})
    sourceId: string;

    @Prop({required: true, type: String, enum: Object.keys(NotificationQueueDocumentKind), default: NotificationQueueDocumentKind.NQDKCommentNotification})
    nqdKind: NotificationQueueDocumentKind;

    @Prop({required: true, type: Number, default: 0})
    publishStatus: PublishStatus

    @Prop({required: true})
    title: string;
    
    @Prop()
    createdAt: Date;
    
    @Prop()
    updatedAt: Date;

    // Why not just use NotificationKind as our discriminator?
    // Because MongoDB discriminator names must be globally unique.
    public get kind(): NotificationKind {
        switch (this.nqdKind) {
            case NotificationQueueDocumentKind.NQDKBlogNotification: {
                return NotificationKind.BlogNotification;
            }
            case NotificationQueueDocumentKind.NQDKCommentNotification: {
                return NotificationKind.CommentNotification;
            }
            case NotificationQueueDocumentKind.NQDKNewsPostNotification: {
                return NotificationKind.NewsPostNotification;
            }
            case NotificationQueueDocumentKind.NQDKPMReplyNotification: {
                return NotificationKind.PMReplyNotification;
            }
            case NotificationQueueDocumentKind.NQDKPMThreadNotification: {
                return NotificationKind.PMThreadNotification;
            }
            case NotificationQueueDocumentKind.NQDKSectionNotification: {
                return NotificationKind.SectionNotification;
            }
            case NotificationQueueDocumentKind.NQDKWorkNotification: {
                return NotificationKind.WorkNotification;
            }
        }
    }
    public set kind(kind: NotificationKind) {
        switch (kind) {
            case NotificationKind.BlogNotification: {
                this.nqdKind = NotificationQueueDocumentKind.NQDKBlogNotification;
            }
            case NotificationKind.CommentNotification: {
                this.nqdKind = NotificationQueueDocumentKind.NQDKCommentNotification;
            }
            case NotificationKind.NewsPostNotification: {
                this.nqdKind = NotificationQueueDocumentKind.NQDKNewsPostNotification;
            }
            case NotificationKind.PMReplyNotification: {
                this.nqdKind = NotificationQueueDocumentKind.NQDKPMReplyNotification;
            }
            case NotificationKind.PMThreadNotification: {
                this.nqdKind = NotificationQueueDocumentKind.NQDKPMThreadNotification;
            }
            case NotificationKind.SectionNotification: {
                this.nqdKind = NotificationQueueDocumentKind.NQDKSectionNotification;
            }
            case NotificationKind.WorkNotification: {
                this.nqdKind = NotificationQueueDocumentKind.NQDKWorkNotification;
            }
        }
    }
}

export const NotificationQueueSchema = SchemaFactory.createForClass(NotificationQueueDocument);