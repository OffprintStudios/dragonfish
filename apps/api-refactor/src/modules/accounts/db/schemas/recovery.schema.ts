import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Recovery } from '$shared/models/accounts';

@Schema({ timestamps: true, autoIndex: true, collection: 'recovery' })
export class RecoveryDocument extends Document implements Recovery {
  @Prop({ required: true })
  readonly _id: string;

  @Prop({ required: true, ref: 'Account', type: String, index: true })
  readonly accountId: string;

  @Prop()
  readonly resetCode: string;

  @Prop()
  readonly expires: Date;
}

export const RecoverySchema = SchemaFactory.createForClass(RecoveryDocument);
