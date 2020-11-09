import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationSourceKind, PublishStatus, UnpublishedNotification } from '@pulp-fiction/models/notifications';

const FiveMB: number = 5_242_880; // Even this is probably overkill

@Schema({    
    'timestamps': true,
    capped: { size: FiveMB },
    collection: 'unpublished_notifications'
})
export class UnpublishedNotificationDocument extends Document implements UnpublishedNotification {
    @Prop({required: true})
    sourceId: string;

    @Prop({required: true, type: String, enum: Object.keys(NotificationSourceKind), default: 'Comment'})
    sourceKind: NotificationSourceKind;

    @Prop()
    sourceParentId?: string | undefined;

    @Prop({type: String, enum: Object.keys(NotificationSourceKind)})
    sourceParentKind?: NotificationSourceKind | undefined;

    @Prop({required: true, type: String, enum: Object.keys(PublishStatus), default: 'NotStarted'})
    publishStatus: PublishStatus

    @Prop({required: true})
    title: string;

    @Prop()
    body?: string;
    
    createdAt: Date;
    
    updatedAt: Date;
}

export const UnpublishedNotificationSchema = SchemaFactory.createForClass(UnpublishedNotificationDocument);