import { Schema, Prop, SchemaFactory, getModelToken } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { NotificationKind, NotificationBase } from '@pulp-fiction/models/notifications';
import { NotificationDocumentKind } from './publishedNotifications/notification-document-kind';
import { Model } from 'mongoose';
import { BlogNotificationDocument, CommentNotificationDocument, NewsPostNotificationDocument, PMReplyNotificationDocument, PMThreadNotificationDocument, SectionNotificationDocument, WorkNotificationDocument } from './publishedNotifications';
import { NotificationEnumConverters } from './notification-enum-converters';
import { ContentKind } from '@pulp-fiction/models/content';
import { Provider } from '@nestjs/common';
import { getSubSchemaProvider, NOTIFICATION_MOODEL_TOKEN } from './notifications.module';
import { SubSchemas } from './sub-schemas';

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

    // Gotta do these naming and type shenanaigans because Mongo discriminator names must be unique,
    // so this can't just go into the DB as the names inside NotificationKind.
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

export const NotificationSubSchemaProviders: Provider[] = [
    getSubSchemaProvider('WorkNotification', NOTIFICATION_MOODEL_TOKEN, getWorkNotificationSubSchema),
    getSubSchemaProvider('SectionNotification', NOTIFICATION_MOODEL_TOKEN, getSectionNotificationSubSchema),
    getSubSchemaProvider('BlogNotification', NOTIFICATION_MOODEL_TOKEN, getBlogNotificationSubSchema),
    getSubSchemaProvider('CommentNotification', NOTIFICATION_MOODEL_TOKEN, getCommentNotificationSubSchema),
    getSubSchemaProvider('NewsPostNotification', NOTIFICATION_MOODEL_TOKEN, getNewsPostNotificationSubSchema),
    getSubSchemaProvider('PMThreadNotification', NOTIFICATION_MOODEL_TOKEN, getPMThreadNotificationSubSchema),
    getSubSchemaProvider('PMReplyNotification', NOTIFICATION_MOODEL_TOKEN, getPMReplyNotificationSubSchema),  
];

// Builders for sub-schemas
function getWorkNotificationSubSchema(model: Model<NotificationDocument>): Model<WorkNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKWorkNotification, 
        new MongooseSchema(SubSchemas.WorkNotification)
    );
}

function getSectionNotificationSubSchema(model: Model<NotificationDocument>): Model<SectionNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKSectionNotification,
        new MongooseSchema(SubSchemas.SectionNotification)
    );
}

function getBlogNotificationSubSchema(model: Model<NotificationDocument>): Model<BlogNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKBlogNotification, 
        new MongooseSchema(SubSchemas.BlogNotification)
    );
}

function getCommentNotificationSubSchema(model: Model<NotificationDocument>): Model<CommentNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKCommentNotification, 
        new MongooseSchema(SubSchemas.CommentNotification)
    );
}

function getNewsPostNotificationSubSchema(model: Model<NotificationDocument>): Model<NewsPostNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKNewsPostNotification,
        new MongooseSchema(SubSchemas.NewsPostNotification)
    );
}

function getPMThreadNotificationSubSchema(model: Model<NotificationDocument>): Model<PMThreadNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKPMThreadNotification,
        new MongooseSchema(SubSchemas.PMThreadNotification)
    );
}

function getPMReplyNotificationSubSchema(model: Model<NotificationDocument>): Model<PMReplyNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKPMReplyNotification,
        new MongooseSchema(SubSchemas.PMReplyNotification)
    );
}