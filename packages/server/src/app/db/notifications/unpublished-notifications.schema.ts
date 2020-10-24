import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationKind, UnpublishedNotification } from '@pulp-fiction/models/notifications';

@Schema({
    'discriminatorKey': 'kind',
    'timestamps': true,
})
export class UnpublishedNotificationDocument extends Document implements UnpublishedNotification {
    @Prop({required: true})
    sourceId: string;

    @Prop()
    sourceParentId?: string;

    @Prop({required: true, type: String, enum: Object.keys(NotificationKind), default: 'Comment'})
    kind: NotificationKind;

    @Prop({required: true})
    title: string;

    @Prop()
    body?: string;

    @Prop({required: true, default: Date.now()})
    createdAt: Date;

    @Prop({required: true, default: Date.now()})
    updatedAt: Date;
}

export const UnpublishedNotificationSchema = SchemaFactory.createForClass(UnpublishedNotificationDocument);