import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationKind } from '@pulp-fiction/models/notifications';

import { NotificationQueueItem } from './notificationQueue/notification-queue-item.model';
import { PublishStatus } from './notificationQueue/publish-status';
import { NotificationQueueDocumentKind } from './notificationQueue/notification-queue-document-kind';
import { NotificationEnumConverters } from './notification-enum-converters';

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

    // Gotta do these naming and type shenanaigans because Mongo discriminator names must be unique.
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