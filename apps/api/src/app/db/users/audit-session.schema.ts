import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuditSession } from '@dragonfish/shared/models/users';

@Schema({ timestamps: true })
export class AuditSessionDocument extends Document implements AuditSession {
    @Prop({ type: String, required: [true, `You must provide a Session ID.`] })
    readonly _id: string;

    @Prop({ type: Date, required: [true, `You must provide an expiration date.`] })
    readonly expires: Date;

    @Prop()
    readonly createdAt: Date;
}

export const AuditSessionSchema = SchemaFactory.createForClass(AuditSessionDocument);
