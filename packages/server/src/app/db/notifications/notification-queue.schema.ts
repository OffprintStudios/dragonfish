import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationSourceKind, PublishStatus, NotificationQueueItem } from '@pulp-fiction/models/notifications';

const FiveMB: number = 5_242_880; // Even this is probably overkill

@Schema({    
    'timestamps': true,
    capped: { size: FiveMB },
    collection: 'notification_queue'
})
export class NotificationQueueDocument extends Document implements NotificationQueueItem {
    @Prop({required: true})
    sourceId: string;

    @Prop({required: true, type: String, enum: Object.keys(NotificationSourceKind), default: 'Comment'})
    sourceKind: NotificationSourceKind;

    @Prop()
    sourceParentId?: string | undefined;

    @Prop({type: String, enum: Object.keys(NotificationSourceKind)})
    sourceParentKind?: NotificationSourceKind | undefined;

    @Prop({required: true, type: Number, default: 0})
    publishStatus: PublishStatus

    @Prop({required: true})
    title: string;

    @Prop()
    body?: string;
    
    createdAt: Date;
    
    updatedAt: Date;
}

export const NotificationQueueSchema = SchemaFactory.createForClass(NotificationQueueDocument);