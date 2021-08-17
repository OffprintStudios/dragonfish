import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ActionType, CaseKind, UserCaseFile } from '@dragonfish/shared/models/case-files';
import { ReportDocument } from './reports.schema';
import { NotesDocument } from './notes.schema';
import { Account, Pseudonym } from '@dragonfish/shared/models/accounts';

@Schema()
export class UserCaseFileDocument extends Document implements UserCaseFile {
    readonly _id: number;
    reports: ReportDocument[];
    notes: NotesDocument[];
    isClosed: boolean;
    claimedBy: string | Pseudonym;
    action: {
        hasType: ActionType;
        date: Date;
        reason: string;
    };
    readonly kind: CaseKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    @Prop({
        type: String,
        ref: 'Account',
        autopopulate: {
            select: '-password -email -sessions -termsAgree -emailConfirmed -updatedAt',
        },
        required: true,
    })
    user: string | Account;
}

export const UserCaseFileSchema = SchemaFactory.createForClass(UserCaseFileDocument);
