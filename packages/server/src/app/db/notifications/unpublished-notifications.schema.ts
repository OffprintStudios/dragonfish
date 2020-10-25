import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationSourceKind, PublishStatus, UnpublishedNotification } from '@pulp-fiction/models/notifications';

const FiveMB: number = 5_242_880; // Even this is probably overkill

@Schema({
    'discriminatorKey': 'kind',
    'timestamps': true,
    capped: { size: FiveMB }
})
export class UnpublishedNotificationDocument extends Document implements UnpublishedNotification {
    @Prop({required: true})
    sourceId: string;

    @Prop({required: true, type: String, enum: Object.keys(NotificationSourceKind), default: 'Comment'})
    sourceKind: NotificationSourceKind;

    @Prop()
    sourceParentId?: string | undefined;

    @Prop()
    sourceParentKind?: NotificationSourceKind | undefined;

    @Prop({required: true, type: String, enum: Object.keys(PublishStatus), default: 'NotStarted'})
    publishStatus: PublishStatus

    @Prop({required: true})
    title: string;

    @Prop()
    body?: string;

    @Prop({required: true})
    createdAt: Date;

    @Prop({required: true})
    updatedAt: Date;
}

export const UnpublishedNotificationSchema = SchemaFactory.createForClass(UnpublishedNotificationDocument);