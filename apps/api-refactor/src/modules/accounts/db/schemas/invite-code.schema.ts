// This schema is temporary and only applicable to the Closed Alpha (aka, the Origins Arc)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { InviteCodes } from '$shared/models/accounts';

@Schema({ collection: 'invite_codes' })
export class InviteCodesDocument extends Document implements InviteCodes {
  @Prop({ required: true }) readonly _id: string;
  @Prop({ default: false }) readonly used: boolean;
  @Prop({ ref: 'User' }) readonly byWho: string;
}

export const InviteCodesSchema =
  SchemaFactory.createForClass(InviteCodesDocument);
