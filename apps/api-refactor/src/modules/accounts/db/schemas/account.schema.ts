import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Account, Roles } from '$shared/models/accounts';
import { PseudonymDocument } from './pseudonym.schema';

@Schema({ timestamps: true, autoIndex: true, collection: 'accounts' })
export class AccountDocument extends Document implements Account {
  @Prop({ default: () => nanoid(7) })
  readonly _id: string;

  @Prop({ trim: true, required: true, index: true, unique: true })
  email: string;

  @Prop({ trim: true, required: true })
  password: string;

  @Prop({ type: [String], ref: 'Pseudonym', default: [] })
  pseudonyms: string[] | PseudonymDocument[];

  @Prop({ type: [String], enum: Object.keys(Roles), default: ['User'] })
  roles: Roles[];

  @Prop({ required: true, default: false })
  termsAgree: boolean;

  @Prop({ default: false })
  emailConfirmed: boolean;

  @Prop()
  readonly createdAt: Date;

  @Prop()
  readonly updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(AccountDocument);
