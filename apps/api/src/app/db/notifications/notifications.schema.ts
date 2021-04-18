import { Provider } from '@nestjs/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Model, Document, Schema as MongooseSchema } from 'mongoose';

import { NotificationKind, NotificationBase } from '@dragonfish/models/notifications';

import { NotificationDocumentKind } from './publishedNotifications/notification-document-kind';
import {
    BlogNotificationDocument,
    CommentNotificationDocument,
    NewsPostNotificationDocument,
    PMReplyNotificationDocument,
    PMThreadNotificationDocument,
    SectionNotificationDocument,
    WorkNotificationDocument,
} from './publishedNotifications';
import { NotificationEnumConverters } from './notification-enum-converters';
import { getSubSchemaProvider } from './notifications.module';
import { SubSchemas } from './sub-schemas';

const NOTIFICATION_MOODEL_TOKEN: string = 'Notification';

@Schema({
    timestamps: true,
    autoIndex: true,
    discriminatorKey: 'ndKind',
    toJSON: { getters: true },
})
export class NotificationDocument extends Document implements NotificationBase {
    @Prop({ required: true, index: true })
    destinationUserId: string;

    @Prop({ required: true })
    sourceId: string;

    // Gotta do these naming and type shenanaigans because Mongo discriminator names must be unique,
    // so this can't just go into the DB as the names inside NotificationKind.
    @Prop({
        alias: 'ndKind',
        required: true,
        type: String,
        enum: Object.keys(NotificationDocumentKind),
        get: (ndk) => NotificationEnumConverters.ndkAsNotificationKind(ndk),
        set: (notifKind) => NotificationEnumConverters.notificationKindAsNDK(notifKind),
    })
    kind: NotificationKind;

    @Prop({ required: true })
    read: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
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
        new MongooseSchema(SubSchemas.getWorkNotification()),
    );
}

function getSectionNotificationSubSchema(model: Model<NotificationDocument>): Model<SectionNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKSectionNotification,
        new MongooseSchema(SubSchemas.getSectionNotification()),
    );
}

function getBlogNotificationSubSchema(model: Model<NotificationDocument>): Model<BlogNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKBlogNotification,
        new MongooseSchema(SubSchemas.getBlogNotification()),
    );
}

function getCommentNotificationSubSchema(model: Model<NotificationDocument>): Model<CommentNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKCommentNotification,
        new MongooseSchema(SubSchemas.getCommentNotification()),
    );
}

function getNewsPostNotificationSubSchema(model: Model<NotificationDocument>): Model<NewsPostNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKNewsPostNotification,
        new MongooseSchema(SubSchemas.getNewsPostNotification()),
    );
}

function getPMThreadNotificationSubSchema(model: Model<NotificationDocument>): Model<PMThreadNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKPMThreadNotification,
        new MongooseSchema(SubSchemas.getPMThreadNotification()),
    );
}

function getPMReplyNotificationSubSchema(model: Model<NotificationDocument>): Model<PMReplyNotificationDocument> {
    return model.discriminator(
        NotificationDocumentKind.NDKPMReplyNotification,
        new MongooseSchema(SubSchemas.getPMReplyNotification()),
    );
}
