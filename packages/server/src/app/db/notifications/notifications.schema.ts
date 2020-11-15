import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationKind, NotificationBase } from '@pulp-fiction/models/notifications';
import { NotificationDocumentKind } from './publishedNotifications/notification-document-kind';

@Schema({    
    'timestamps': true,
    autoIndex: true,
    'discriminatorKey': 'ndKind'
})
export class NotificationDocument extends Document implements NotificationBase {    
    @Prop({required: true, index: true})
    destinationUserId: string;    
    
    @Prop({required: true})
    sourceId: string;

    @Prop({required: true, type: String, enum: Object.keys(NotificationDocumentKind), default: NotificationDocumentKind.NDKCommentNotification})
    ndKind: NotificationDocumentKind

    @Prop({required: true})
    title: string;

    @Prop({required: true})
    read: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date

    // Why not just use NotificationKind as our discriminator?
    // Because MongoDB discriminator names must be globally unique.
    public get kind(): NotificationKind {
        switch (this.ndKind) {
            case NotificationDocumentKind.NDKBlogNotification: {
                return NotificationKind.BlogNotification;
            }
            case NotificationDocumentKind.NDKCommentNotification: {
                return NotificationKind.CommentNotification;
            }
            case NotificationDocumentKind.NDKNewsPostNotification: {
                return NotificationKind.NewsPostNotification;
            }
            case NotificationDocumentKind.NDKPMReplyNotification: {
                return NotificationKind.PMReplyNotification;
            }
            case NotificationDocumentKind.NDKPMThreadNotification: {
                return NotificationKind.PMThreadNotification;
            }
            case NotificationDocumentKind.NDKSectionNotification: {
                return NotificationKind.SectionNotification;
            }
            case NotificationDocumentKind.NDKWorkNotification: {
                return NotificationKind.WorkNotification;
            }
        }
    }
    public set kind(kind: NotificationKind) {
        switch (kind) {
            case NotificationKind.BlogNotification: {
                this.ndKind = NotificationDocumentKind.NDKBlogNotification;
            }
            case NotificationKind.CommentNotification: {
                this.ndKind = NotificationDocumentKind.NDKCommentNotification;
            }
            case NotificationKind.NewsPostNotification: {
                this.ndKind = NotificationDocumentKind.NDKNewsPostNotification;
            }
            case NotificationKind.PMReplyNotification: {
                this.ndKind = NotificationDocumentKind.NDKPMReplyNotification;
            }
            case NotificationKind.PMThreadNotification: {
                this.ndKind = NotificationDocumentKind.NDKPMThreadNotification;
            }
            case NotificationKind.SectionNotification: {
                this.ndKind = NotificationDocumentKind.NDKSectionNotification;
            }
            case NotificationKind.WorkNotification: {
                this.ndKind = NotificationDocumentKind.NDKWorkNotification;
            }
        }
    }
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);