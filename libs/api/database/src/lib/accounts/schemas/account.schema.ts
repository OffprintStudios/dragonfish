import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Roles } from '@dragonfish/shared/models/accounts/audit';
import { SessionInfoDocument, SessionInfoSchema } from './session-info.schema';
import { PseudonymDocument } from './pseudonym.schema';
import { Account } from '@dragonfish/shared/models/accounts';

@Schema({ timestamps: true, autoIndex: true, collection: 'accounts' })
export class AccountDocument extends Document implements Account {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ trim: true, required: true, index: true, unique: true })
    email: string;

    @Prop({ trim: true, required: true })
    password: string;

    @Prop({ type: [String], ref: 'Pseudonym', default: [], autopopulate: { select: '-accountId' } })
    pseudonyms: string[] | PseudonymDocument[];

    @Prop({ type: [String], enum: Object.keys(Roles), default: ['User'] })
    roles: Roles[];

    @Prop({ type: [SessionInfoSchema], default: null })
    sessions: SessionInfoDocument[];

    @Prop({ required: true, default: false })
    termsAgree: boolean;

    @Prop({ default: false })
    emailConfirmed: boolean;

    @Prop(
        raw({
            resetCode: { type: String, trim: true },
            expires: { type: Date },
        }),
    )
    recovery: {
        resetCode: string;
        expires: Date;
    };

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(AccountDocument);
