import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { NotificationKind, NotificationBase } from '@pulp-fiction/models/notifications';
import { NotificationDocumentKind } from './publishedNotifications/notification-document-kind';
import { Model } from 'mongoose';
import { BlogNotificationDocument, SectionNotificationDocument, WorkNotificationDocument } from './publishedNotifications';
import { NotificationEnumConverters } from './notification-enum-converters';

@Schema({    
    'timestamps': true,
    autoIndex: true,
    'discriminatorKey': 'ndKind',
    toJSON: { getters: true }
})
export class NotificationDocument extends Document implements NotificationBase {    
    @Prop({required: true, index: true})
    destinationUserId: string;    
    
    @Prop({required: true})
    sourceId: string;

    // Gotta do these naming and type shenanaigans because Mongo discriminator names must be unique.
    @Prop({alias: 'ndKind', required: true, type: String, enum: Object.keys(NotificationDocumentKind),         
        get: ndk => NotificationEnumConverters.ndkAsNotificationKind(ndk),
        set: notifKind => NotificationEnumConverters.notificationKindAsNDK(notifKind)})
    kind: NotificationKind

    @Prop({required: true})
    read: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);

// Builders for sub-schemas
export function getWorkNotificationSubSchema(notificationModel: Model<NotificationDocument>): Model<WorkNotificationDocument> {
    return notificationModel.discriminator(NotificationDocumentKind.NDKWorkNotification, new MongooseSchema({
        // WorkNotifications
      }));
}

export function getSectionNotificationSubSchema(notificationModel: Model<NotificationDocument>): Model<SectionNotificationDocument> {
    return notificationModel.discriminator(NotificationDocumentKind.NDKSectionNotification, new MongooseSchema({
        // Section notifications
      }));
}

export function getBlogNotificationSubSchema(notificationModel: Model<NotificationDocument>): Model<BlogNotificationDocument> {
    return notificationModel.discriminator(NotificationDocumentKind.NDKBlogNotification, new MongooseSchema({      
        authorId: {type: String, trim: true, required: true},
        authorName: {type: String, required: true},
      }));
}