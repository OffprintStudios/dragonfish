import { Provider } from '@nestjs/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Model, Document, Schema as MongooseSchema } from 'mongoose';

import { NotificationKind } from '@dragonfish/shared/models/notifications';

import { NotificationQueueDocumentKind } from './notificationQueue/notification-queue-document-kind';
import {
    WorkNotificationQueueDocument,
    SectionNotificationQueueDocument,
    BlogNotificationQueueDocument,
    CommentNotificationQueueDocument,
    NewsPostNotificationQueueDocument,
    PMThreadNotificationQueueDocument,
    PMReplyNotificationQueueDocument,
} from './notificationQueue';
import { NotificationEnumConverters } from './notification-enum-converters';
import { NotificationQueueItem } from './notificationQueue/notification-queue-item.model';
import { PublishStatus } from './notificationQueue/publish-status';
import { getSubSchemaProvider } from './notifications.module';
import { SubSchemas } from './sub-schemas';

const FiveMB = 5_242_880; // Even this is probably overkill
const NOTIFICATION_QUEUE_MODEL_TOKEN = 'NotificationQueue';

@Schema({
    timestamps: true,
    capped: { size: FiveMB },
    collection: 'notification_queue',
    discriminatorKey: 'nqdKind',
    toJSON: { getters: true },
})
export class NotificationQueueDocument extends Document implements NotificationQueueItem {
    @Prop({ required: true })
    sourceId: string;

    @Prop({ required: false })
    creatorUserId?: string;

    // Gotta do these naming and type shenanaigans because Mongo discriminator names must be unique,
    // so this can't just go into the DB as the names inside NotificationKind.
    @Prop({
        alias: 'nqdKind',
        required: true,
        type: String,
        enum: Object.keys(NotificationQueueDocumentKind),
    })
    kind: NotificationKind;

    @Prop({ required: true, type: Number, default: 0 })
    publishStatus: PublishStatus;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const NotificationQueueSchema = SchemaFactory.createForClass(NotificationQueueDocument);

export const NotificationQueueSubSchemaProviders: Provider[] = [
    getSubSchemaProvider('WorkNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getWorkNotificationSubSchema),
    getSubSchemaProvider(
        'SectionNotificationQueueItem',
        NOTIFICATION_QUEUE_MODEL_TOKEN,
        getSectionNotificationSubSchema,
    ),
    getSubSchemaProvider('BlogNotificationQueueItem', NOTIFICATION_QUEUE_MODEL_TOKEN, getBlogNotificationSubSchema),
    getSubSchemaProvider(
        'CommentNotificationQueueItem',
        NOTIFICATION_QUEUE_MODEL_TOKEN,
        getCommentNotificationSubSchema,
    ),
    getSubSchemaProvider(
        'NewsPostNotificationQueueItem',
        NOTIFICATION_QUEUE_MODEL_TOKEN,
        getNewsPostNotificationSubSchema,
    ),
    getSubSchemaProvider(
        'PMThreadNotificationQueueItem',
        NOTIFICATION_QUEUE_MODEL_TOKEN,
        getPMThreadNotificationSubSchema,
    ),
    getSubSchemaProvider(
        'PMReplyNotificationQueueItem',
        NOTIFICATION_QUEUE_MODEL_TOKEN,
        getPMReplyNotificationSubSchema,
    ),
];

// Builders for sub-schemas
function getWorkNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<WorkNotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKWorkNotification,
        new MongooseSchema(SubSchemas.getWorkNotification()),
    );
}

function getSectionNotificationSubSchema(
    model: Model<NotificationQueueDocument>,
): Model<SectionNotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKSectionNotification,
        new MongooseSchema(SubSchemas.getSectionNotification()),
    );
}

function getBlogNotificationSubSchema(model: Model<NotificationQueueDocument>): Model<BlogNotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKBlogNotification,
        new MongooseSchema(SubSchemas.getBlogNotification()),
    );
}

function getCommentNotificationSubSchema(
    model: Model<NotificationQueueDocument>,
): Model<CommentNotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKCommentNotification,
        new MongooseSchema(SubSchemas.getCommentNotification()),
    );
}

function getNewsPostNotificationSubSchema(
    model: Model<NotificationQueueDocument>,
): Model<NewsPostNotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKNewsPostNotification,
        new MongooseSchema(SubSchemas.getNewsPostNotification()),
    );
}

function getPMThreadNotificationSubSchema(
    model: Model<NotificationQueueDocument>,
): Model<PMThreadNotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKPMThreadNotification,
        new MongooseSchema(SubSchemas.getPMThreadNotification()),
    );
}

function getPMReplyNotificationSubSchema(
    model: Model<NotificationQueueDocument>,
): Model<PMReplyNotificationQueueDocument> {
    return model.discriminator(
        NotificationQueueDocumentKind.NQDKPMReplyNotification,
        new MongooseSchema(SubSchemas.getPMReplyNotification()),
    );
}
