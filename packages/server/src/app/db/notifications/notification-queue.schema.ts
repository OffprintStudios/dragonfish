import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { NotificationBase, NotificationKind } from '@pulp-fiction/models/notifications';

import { NotificationQueueItem } from './notificationQueue/notification-queue-item.model';
import { PublishStatus } from './notificationQueue/publish-status';
import { NotificationQueueDocumentKind } from './notificationQueue/notification-queue-document-kind';
import { NotificationEnumConverters } from './notification-enum-converters';
import { getSubSchemaProvider, NOTIFICATION_QUEUE_MODEL_TOKEN } from './notifications.module';
import { Model } from 'mongoose';
import { Provider } from '@nestjs/common';
import { SubSchemas } from './sub-schemas';

const FiveMB: number = 5_242_880; // Even this is probably overkill

@Schema({    
    timestamps: true,
    capped: { size: FiveMB },
    collection: 'notification_queue',
    discriminatorKey: 'nqdKind',
    toJSON: { getters: true }
})
export class NotificationQueueDocument extends Document implements NotificationQueueItem {
    @Prop({required: true})
    sourceId: string;

    // Gotta do these naming and type shenanaigans because Mongo discriminator names must be unique,
    // so this can't just go into the DB as the names inside NotificationKind.
    @Prop({alias: 'nqdKind', required: true, type: String, enum: Object.keys(NotificationQueueDocumentKind),         
        get: nqdk => NotificationEnumConverters.nqdkAsNotificationKind(nqdk),
        set: notifKind => NotificationEnumConverters.notificationKindAsNQDK(notifKind)})
    kind: NotificationKind;

    @Prop({required: true, type: Number, default: 0})
    publishStatus: PublishStatus
    
    @Prop()
    createdAt: Date;
    
    @Prop()
    updatedAt: Date;
}

export const NotificationQueueSchema = SchemaFactory.createForClass(NotificationQueueDocument);

export const NotificationQueueSubSchemaProviders: Provider[] = [
    getSubSchemaProvider('WorkNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getWorkNotificationSubSchema),
    getSubSchemaProvider('SectionNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getSectionNotificationSubSchema),
    getSubSchemaProvider('BlogNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getBlogNotificationSubSchema),
    getSubSchemaProvider('CommentNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getCommentNotificationSubSchema),
    getSubSchemaProvider('NewsPostNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getNewsPostNotificationSubSchema),
    getSubSchemaProvider('PMThreadNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getPMThreadNotificationSubSchema),    
    getSubSchemaProvider('PMReplyNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getPMReplyNotificationSubSchema),
];

// Builders for sub-schemas
function getWorkNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<NotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKWorkNotification,
        new MongooseSchema(SubSchemas.WorkNotification)
    );
}

function getSectionNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<NotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKSectionNotification,
        new MongooseSchema(SubSchemas.SectionNotification)
    );
}

function getBlogNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<NotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKBlogNotification,
        new MongooseSchema(SubSchemas.BlogNotification)
    );
}

function getCommentNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<NotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKCommentNotification,
        new MongooseSchema(SubSchemas.CommentNotification)
    );
}

function getNewsPostNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<NotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKNewsPostNotification,
        new MongooseSchema(SubSchemas.NewsPostNotification)
    );
}

function getPMThreadNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<NotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKPMThreadNotification,
        new MongooseSchema(SubSchemas.PMThreadNotification)
    );
}

function getPMReplyNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<NotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKPMReplyNotification,
        new MongooseSchema(SubSchemas.PMReplyNotification)
    );
}