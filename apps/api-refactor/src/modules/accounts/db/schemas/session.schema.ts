import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Session } from '$shared/models/accounts';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, autoIndex: true, collection: 'sessions' })
export class SessionDocument extends Document implements Session {
  @Prop({ default: () => nanoid() })
  readonly _id: string;

  @Prop({ type: String, ref: 'Account', required: true, index: true })
  readonly accountId: string;

  @Prop({ required: true })
  readonly deviceBrowser: string;

  @Prop({ required: true })
  readonly deviceOS: string;

  @Prop({ required: true })
  readonly ipAddr: string;

  @Prop({ required: true })
  readonly expires: Date;

  @Prop()
  readonly createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionDocument);
