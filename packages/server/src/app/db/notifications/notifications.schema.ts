import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationSourceKind, Notification } from '@pulp-fiction/models/notifications';

@Schema({
    'discriminatorKey': 'kind',
    'timestamps': true,
    autoIndex: true,
})
export class NotificationDocument extends Document implements Notification {    
    @Prop({required: true, index: true})
    destinationUserId: string;    
    
    @Prop({required: true})
    sourceId: string;

    @Prop({required: true, type: String, enum: Object.keys(NotificationSourceKind), default: 'Comment'})
    sourceKind: NotificationSourceKind

    @Prop()
    sourceParentId?: string | undefined;

    @Prop()
    sourceParentKind?: NotificationSourceKind | undefined;

    @Prop({required: true})
    title: string;

    @Prop()
    body?: string | undefined;

    @Prop({required: true})
    createdAt: Date;

    @Prop({required: true})
    updatedAt: Date
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);