import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SessionInfo } from '@dragonfish/shared/models/accounts/audit';

@Schema({ timestamps: true })
export class SessionInfoDocument extends Types.Subdocument implements SessionInfo {
    @Prop({ required: true })
    readonly _id: string;

    @Prop({ required: true })
    readonly expires: Date;

    @Prop({ required: true })
    readonly deviceOS: string;

    @Prop({ required: true })
    readonly deviceBrowser: string;

    @Prop({ required: true })
    readonly ipAddr: string;

    @Prop()
    readonly createdAt: Date;
}

export const SessionInfoSchema = SchemaFactory.createForClass(SessionInfoDocument);
